import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import { login, register } from "./controllers/user_controllers.js";
import userRoutes from "./routes/user_route.js";
import postRoutes from "./routes/post_route.js";
dotenv.config({});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use(cors(corsOption));
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.json({
    msg: "healty",
    success: true,
  });
});

app.post("/register", register);
app.post("/login", login);

app.listen(port, () => {
  connectDb();
  console.log("listening to port ", port);
});

//mongodb+srv://juisch20220011252:ozZrSOdX9QcTayGu@cluster0.4zfan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
