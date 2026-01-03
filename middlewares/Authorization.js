const jwt = require("jsonwebtoken");
const User = require("../models/User");

// authorization
exports.auth = async (req, res, next) => {
  try {
    // console.log("Req.headers", req);
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.headers.authorization?.split(" ").pop();

    // const token = req.headers.authorization?.split(" ")[1];
    // cookies,body,authorization
    if (!token)
      return res.status(401).json({
        success: false,
        message: "JWT token is missing",
      });

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode)
      return res.status(404).json({
        success: false,
        message: "Invalid token or modified token .Please login again",
      });

    if (!decode)
      return res.status(401).json({
        success: false,
        message: "Invalid token or token has been modified. Please login again",
      });

    // decode object me user detail or expiry hoti hai
    // console.log("TOKEN:", token);
    // console.log("DECODE:", decode);
    req.user = decode;
    next();
  } catch (err) {
    console.log("ERROR WHILE AUTHORIZATION", err);
    return res.status(500).json({
      success: false,
      message: err.message ? err.message : "Internal server error",
      path: "./middlewares/authorization/auth",
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    // some one is escaping authorization
    // if (!req.user)
    //   return res.status(401).json({
    //     success: false,
    //     message: "Unauthorized. Token not found or invalid",
    //   });
    // console.log("REQ.USER", req.user);
    const userId = req.user.id;
    if (!userId)
      return res.status(400).json({
        success: false,
        message: "Toke not found",
      });
    // console.log("req.user", req.user);
    const user = await User.findById(userId);

    //     account type match
    if (user.accountType !== "Admin")
      return res.status(400).json({
        success: false,
        message: "This route is protected for Admins only",
      });
    next();
  } catch (err) {
    console.log("ERROR WHILE VALIDATING USER", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while validating user",
      error: err.message,
      path: "./middlewares/Authorization/isAdmin",
    });
  }
};

// isClient
exports.isClient = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!userId)
      return res.status(400).json({
        success: false,
        message: "Token not found",
      });
    // console.log("req.user", req.user);
    const user = await User.findById(userId);

    //     account type match
    if (user?.accountType !== "Client")
      return res.status(400).json({
        success: false,
        message: "This route is protected for Clients only",
      });
    next();
  } catch (err) {
    console.log("ERROR WHILE VALIDATING USER", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while validating user",
      error: err.message,
      path: "./middlewares/Authorization/isClient",
    });
  }
};
