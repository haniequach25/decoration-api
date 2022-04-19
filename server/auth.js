import jwt from "jsonwebtoken";
import TaiKhoan from "./models/TaiKhoan.js";

const auth = async (req, res, next) => {
  if (req.header("Authorization")) {
    const token = req.header["Authorization"].split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_KEY);
    try {
      const user = await User.findOne({ _id: data._id }, { token: token });
      if (!user) {
        throw new Error("Invalid request");
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      res.status(401).json({
        message: "Invalid request",
      });
    }
  } else {
    res.status(401).json({
      message: "Invalid request",
    });
  }
};

export default auth;
