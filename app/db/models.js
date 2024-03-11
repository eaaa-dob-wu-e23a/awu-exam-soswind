import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    registeredEvents: {
       type: [{ type: Schema.Types.ObjectId, ref: "Event",  }],
        default: []
    },
    unRegisteredEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  },
  { timestamps: true },
);

// Hash brugerens password før det gemmes i databasen

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: []
    },
  },

  { timestamps: true },
);


export const models = [
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
  {
    name: "Event",
    schema: eventSchema,
    collection: "events",
  },
];
