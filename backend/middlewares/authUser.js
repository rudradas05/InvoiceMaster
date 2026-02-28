import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Not authorized. Please login again.",
        });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = token_decode.id;
    next();
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Session expired. Please login again.",
        });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid token. Please login again.",
        });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export default authUser;
