import mongoose from "mongoose";
import bcrypt from "bcrypt";

export default async function seedDb() {
  const userCount = await mongoose.models.User.countDocuments();

  if (userCount === 0) {
    console.log("Seeding database...");
    await insertUsers();
  }
}

async function insertData() {
  const users = [
    {
      username: "Søren Madsen",
      email: "madsen@mail.dk",
      password: await bcrypt.hash("password", 10),
    },
    {
      username: "Mie Hansen",
      email: "mie@mail.dk",
      password: await bcrypt.hash("password", 10),
    },
    {
      username: "Martin Hansen",
      email: "martin@mail.dk",
      password: await bcrypt.hash("password", 10),
    },
    {
      username: "Søs Wind",
      email: "soswind@mail.dk",
      password: await bcrypt.hash("password", 10),
    },
    {
      username: "Hanne Andersen",
      email: "hanne@mail.dk",
      password: await bcrypt.hash("password", 10),
    },
    {
      username: "Maj Jensen",
      email: "maj@mail.dk",
      password: await bcrypt.hash("password", 10),
    },

  ];
  await mongoose.models.User.insertMany(users);
}
