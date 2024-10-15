import express from "express";
import { addNewPost } from "../controllers/post_controllers.js";

const router = express.Router();

router.post("/addnewpost", addNewPost);
export default router;
