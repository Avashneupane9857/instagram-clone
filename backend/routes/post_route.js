import express from "express";
import { addNewPost } from "../controllers/post_controllers.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/addnewpost", isAuth, addNewPost);
export default router;
