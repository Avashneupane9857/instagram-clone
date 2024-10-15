import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post_model.js";
import { User } from "../models/user_model.js";
export const addNewPost = async (req, res) => {
  try {
    const caption = req.body.caption;
    const image = req.file;
    const authorId = req.id;

    console.log(authorId);
    console.log(authorId, caption);
    if (!image) {
      return res.status(401).json({
        msg: "Image is required can post without image",
      });
    }
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();
    //yeta image is converted into dataUri
    const fileUri = `data:image/jpeg;base64 ${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return res.status(200).json({
      msg: "Post add vayo haii sathi ho ",
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author}", select: "username, profilePic" })
      .populate({
        path: "comments",
        sort: "createdAt-1",
        populate: {
          path: "author",
          select: "username ,profilePic",
        },
      });

    return res.send(200).json({
      post,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};
export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    console.log(authorId);
    const post = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePic " })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username,profilePic",
        },
      });
    return res.send(200).json({
      post,
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};
export const likePost = async (req, res) => {
  try {
    const whoLikes = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        msg: "No post found",
        success: false,
      });
    }
  } catch (e) {
    console.log(e);
  }
};
//Likes part controller remaining
