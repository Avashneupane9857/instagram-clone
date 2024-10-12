import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ msg: "Invalid Input fill completely", success: false });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ msg: "user already exits", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      msg: "User registered succesfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        msg: "User not found",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        msg: "Password not matched",
        success: false,
      });
    }
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      followimg: user.followimg,
      followers: user.followers,
      posts: user.posts,
    };
    const token = await jwt.sign({ userId: user._id }, process.env.JWT, {
      expiresIn: "1d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        msg: `welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (e) {
    console.log(e);
  }
};
