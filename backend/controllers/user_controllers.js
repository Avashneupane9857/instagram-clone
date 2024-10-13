import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
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

export const logOut = (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      msg: "Looged out succesfullly ",
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById({});
    res.status(200).json({
      user,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const editProfile = async (req, res) => {
  const { bio, gender } = req.body;
  const profilePic = req.file;
  try {
    const userId = req.id;
    let cloudResponse;

    if (profilePic) {
      const fileUri = getDataUri(profilePic);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        msg: "not found",
        sucess: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePic) user.profilePic = cloudResponse.secure_url;
    await user.save();
    return res.status(200).json({
      user,
      msg: "Profile edited",
    });
  } catch (e) {}
};

export const getSuggestedUser = async (req, res) => {
  const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
    "-password "
  );
  if (!suggestedUsers) {
    res.json({
      msg: "No other users",
    });
  }
  res.status(200).json({
    suggestedUsers,
    sucess: true,
  });
};
