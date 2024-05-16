import { client } from "../db.js";
import bcrypt from "bcrypt";

async function userExist(email) {
  return await client.db("users").collection("user").findOne({ email });
}

async function generatePassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function createUser(username, email, password) {
  return await client
    .db("users")
    .collection("user")
    .insertOne({ username, email, password, verifier: "" });
}

async function updateVerifier(randomString, email) {
  return await client
    .db("users")
    .collection("user")
    .updateOne({ email }, { $set: { verifier: randomString } });
}

async function updatePassword(email, newPassword) {
  return await client
    .db("users")
    .collection("user")
    .updateOne({ email }, { $set: { password: newPassword } });
}

async function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i <= length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    randomString += characters[index];
  }
  return randomString;
}

export {
  userExist,
  generatePassword,
  createUser,
  generateRandomString,
  updateVerifier,
  updatePassword,
};
