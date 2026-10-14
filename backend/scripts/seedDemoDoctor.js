import "dotenv/config";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import doctorModel from "../models/doctorModel.js";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("Set MONGODB_URI to a persistent MongoDB connection before seeding.");
}

const doctorEmail = "dr.varshini.demo@example.invalid";

try {
  await mongoose.connect(mongoUri, { dbName: "appointy" });

  const password = await bcrypt.hash(randomBytes(32).toString("hex"), 10);
  const result = await doctorModel.updateOne(
    { email: doctorEmail },
    {
      $set: {
        name: "Dr. Varshini",
        image: "/doctors/dr-varshini.png",
        isDemo: true,
        speciality: "General physician",
        degree: "MBBS, MD (General Medicine)",
        experience: "8 Years",
        about: "Dr. Varshini is an experienced General Physician dedicated to providing comprehensive healthcare and personalized medical guidance. She focuses on preventive care, diagnosis and treatment of common illnesses, and maintaining the overall well-being of her patients.",
        available: true,
        fees: 500,
        slots_booked: {},
        address: {
          line1: "24, Anna Nagar Main Road",
          line2: "Chennai, Tamil Nadu - 600040",
        },
      },
      $setOnInsert: {
        email: doctorEmail,
        password,
        date: Date.now(),
      },
    },
    { upsert: true },
  );

  console.log(
    result.upsertedCount
      ? "Created demo doctor Dr. Varshini."
      : "Updated demo doctor Dr. Varshini.",
  );
} catch (error) {
  console.error("Failed to seed demo doctor:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
