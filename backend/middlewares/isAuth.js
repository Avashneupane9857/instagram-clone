import jwt from "jsonwebtoken";
export const isAuth = async (req, res) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      res.status(401).json({
        msg: "user not authenticated",
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.JWT);
    if (!decode) {
      res.status(401).json({
        msg: "token not decoded",
        success: false,
      });
    }

    req.id = decode.userId;
    next();
  } catch (e) {
    console.log(e);
  }
};
