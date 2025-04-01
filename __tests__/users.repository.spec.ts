import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../src/repositories/users.repository";
import User from "../src/models/users.model";

jest.mock("jsonwebtoken");

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test("should create a user and exclude password from returned object", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    } as any;

    jest.spyOn(bcrypt, "hash").mockImplementation(async () => "hashedPassword");
    const user = await userRepository.create(userData);

    expect(user).toHaveProperty("_id");
    expect(user).toHaveProperty("email", userData.email.toLowerCase());
    expect(user).not.toHaveProperty("password");
  });

  test("should not allow duplicate email registration", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    } as any;

    await userRepository.create(userData);

    await expect(userRepository.create(userData)).rejects.toThrow(
      "Email already taken"
    );
  });

  test("should login a user and return a token", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await User.create({ ...userData, password: hashedPassword });

    // Mock bcrypt.compare to always return true (passwords match)
    jest.spyOn(bcrypt, "compare").mockImplementation(async () => true);

    jest.spyOn(jwt, "sign").mockImplementation(() => "mocked_token");

    const token = await userRepository.login({
      email: userData.email,
      password: userData.password,
    });

    expect(token).toBe("mocked_token");
  });

  test("should throw error if login credentials are incorrect", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    await User.create({
      ...userData,
      password: await bcrypt.hash(userData.password, 10),
    });

    // Mock bcrypt.compare to return `false` (wrong password scenario)
    jest.spyOn(bcrypt, "compare").mockImplementation(async () => false);

    await expect(
      userRepository.login({ email: userData.email, password: "wrongpassword" })
    ).rejects.toThrow("Invalid credentials");
  });

  test("should return a list of users without passwords", async () => {
    const usersData = [
      { name: "User One", email: "user1@example.com", password: "password123" },
      { name: "User Two", email: "user2@example.com", password: "password123" },
    ];
  
    // Hash passwords before saving
    for (const user of usersData) {
      user.password = await bcrypt.hash(user.password, 10);
      await User.create(user);
    }
  
    const users = await userRepository.getUsers();
  
    expect(users).toHaveLength(2);
    users.forEach((user, index) => {
      expect(user).toHaveProperty("_id");
      expect(user).toHaveProperty("email", usersData[index].email);
      expect(user).not.toHaveProperty("password");
    });
  });
  
});
