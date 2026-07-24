import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "../config/database.js";
import Admin from "../models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await Admin.create({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "super-admin",
    });

    console.log("✅ Admin created successfully");

    process.exit(0);

  } catch (error) {
    console.error("❌ Seeder failed");
    console.error(error);

    process.exit(1);
  }
};

seedAdmin();