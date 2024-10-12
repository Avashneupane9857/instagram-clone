import mongoose from "mongoose";
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("mongoDB connected");
  } catch (e) {
    console.log(e);
  }
};
export default connectDb;
