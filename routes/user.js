import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import {
  createUser,
  generatePassword,
  generateRandomString,
  updatePassword,
  updateVerifier,
  userExist,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = await req.body;

    if (!username || !email || !password) {
      return res.status(400).send({ message: "Enter all necessary details" });
    } else {
      const isUserExist = await userExist(email);
      if (isUserExist) {
        return res.status(409).send({ message: "user Already exist" });
      } else {
        const newPassword = await generatePassword(password);

        if (newPassword) {
          const user = await createUser(username, email, newPassword);

          return res.status(201).send({
            message: "user created successfully",
            user,
          });
        }
      }
    }
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = await req.body;

    const user = await userExist(email);

    if (user) {
      const checkPassword = await bcrypt.compare(password, user.password);

      if (checkPassword) {
        return res.status(200).send({
          message: "Login Successful",
          id: user._id,
          username: user.username,
        });
      } else return res.status(400).send({ message: "Incorrect Credentials" });
    }
    return res.status(400).send({ message: "user does not Exists" });
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

router.post("/sendlink", async (req, res) => {
  try {
    const { email } = await req.body;

    const checkUser = await userExist(email);
    if (!checkUser) {
      return res.status(400).send({ message: "user not found " });
    }
    const randomString = await generateRandomString(process.env.STRING_LENGTH);
    await updateVerifier(randomString, email);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const receiver = {
      to: email,
      subject: "Password Reset Request",
      html: `
      <p>Click on this link to reset your password</p>
      <a href="${process.env.CLIENT_URL}?email=${email}&string=${randomString}" >Reset Link</a>`,
    };
    await transporter.sendMail(receiver);
    res.status(200).send({ message: "Reset link send Successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

router.post("/resetpassword/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, confirmPassword, email } = await req.body;

    const user = await userExist(email);

    if (id === user.verifier) {
      if (newPassword === confirmPassword) {
        const password = await generatePassword(newPassword);

        await updatePassword(email, password);
        const randomString = "";
        await updateVerifier(randomString, email);
        return res
          .status(200)
          .send({ message: `${email} password changed successfully` });
      }
      return res
        .status(400)
        .send({ message: "Password and confirm password mismatch" });
    }
    res.status(401).send({ message: "Reset link expired" });
  } catch (error) {
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

export const userRoute = router;
