import Mongoose from "mongoose";
import { useVirtualId } from "../db/database.js";

// SQL: DB Schema O
// NOSQL: DB Schema X, ODM Schema O
const userSchema = new Mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  url: String,
});

// add virtual id : _id -> id
useVirtualId(userSchema);
const User = Mongoose.model("User", userSchema);

export async function findByUsername(username) {
  return User.findOne({ username });
}

export async function findById(id) {
  return User.findById(id);
}

export async function createUser(user) {
  return User.insertOne(user).then((data) => data.id);
}
