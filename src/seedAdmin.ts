// src/seedAdmin.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/users.model";

dotenv.config();

const seedAdminUser = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log("Connected to MongoDB");

    // Check if the admin user already exists
    const adminEmail = process.env.ADMIN_EMAIL;
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    // Create a new admin user
    const adminUser = new User({
      name: process.env.ADMIN_USER,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD, // Plain text, will be hashed by pre-save hook
      roles: ["admin"],
    });

    await adminUser.save();
    console.log("Admin user seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
};

seedAdminUser();
