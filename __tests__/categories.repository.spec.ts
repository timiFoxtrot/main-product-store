import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { CategoryRepository } from "../src/repositories/categories.repository";
import Category from "../src/models/categories.models";
import { ConflictError } from "../src/common/errors/ConflictError";

describe("CategoryRepository", () => {
  let categoryRepository: CategoryRepository;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(() => {
    categoryRepository = new CategoryRepository();
  });

  afterEach(async () => {
    await Category.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test("should create a category", async () => {
    const categoryData = { name: "Electronics" };
    const category = await categoryRepository.create(categoryData);

    expect(category).toHaveProperty("_id");
    expect(category.name).toBe("Electronics");
  });

  test("should not create a duplicate category", async () => {
    const categoryData = { name: "Books" };
    await categoryRepository.create(categoryData);

    await expect(categoryRepository.create(categoryData)).rejects.toThrow(ConflictError);
  });

  test("should find a category by ID", async () => {
    const category = await Category.create({ name: "Fashion" });
    const foundCategory = await categoryRepository.findById(category._id as string);
    expect(foundCategory).not.toBeNull();
    expect(foundCategory?.name).toBe("Fashion");
  });

  test("should return null for non-existent category ID", async () => {
    const foundCategory = await categoryRepository.findById(new mongoose.Types.ObjectId().toString());
    expect(foundCategory).toBeNull();
  });

  test("should find all categories", async () => {
    await Category.create({ name: "Sports" });
    await Category.create({ name: "Gaming" });

    const categories = await categoryRepository.findAll();
    expect(categories.length).toBe(2);
  });

  test("should update a category", async () => {
    const category = await Category.create({ name: "Home Appliances" });
    const updatedCategory = await categoryRepository.update(category._id as string, { name: "Kitchen Appliances" });
    expect(updatedCategory?.name).toBe("Kitchen Appliances");
  });

  test("should delete a category", async () => {
    const category = await Category.create({ name: "Automobiles" });
    const deletedCategory = await categoryRepository.delete(category._id as string);
    expect(deletedCategory?.name).toBe("Automobiles");

    const foundCategory = await categoryRepository.findById(category._id as string);
    expect(foundCategory).toBeNull();
  });
});
