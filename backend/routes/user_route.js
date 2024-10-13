import express from "express";
import {
  editProfile,
  followOrUnfollow,
  getProfile,
  getSuggestedUser,
  login,
  logOut,
  register,
} from "../controllers/user_controllers.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
const router = express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logOut);
router.route("/:id/profile").get(isAuth, getProfile);
router
  .route("/profile/edit")
  .post(isAuth, upload.single("profilePic"), editProfile);
router.route("/suggested").get(isAuth, getSuggestedUser);
router.route("/followorunfollow/:id").post(isAuth, followOrUnfollow);

export default router;
