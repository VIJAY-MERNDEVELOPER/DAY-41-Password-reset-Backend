import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
// import { mongoConnection } from "./db.js";
import { userRoute } from "./routes/user.js";
// import { client } from "./db.js";
dotenv.config();
// initiating server
const app = express();

// Cross-origin resource sharing (CORS) is a mechanism for integrating applications
app.use(cors());
// mongoConnection();
// client;

const PORT = process.env.PORT;

// Inbuilt middlewares
// Interceptor / converting body to JSON
app.use(express.json());

app.use("/api/user", userRoute);

// app.get("/", (req, res) => {
//   console.log("server started");
//   res.status(200).send({ message: "Working Fine" });
// });

app.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
