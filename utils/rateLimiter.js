const rateLimit = require("express-rate-limit");

const createRateLimiter = ({
  windowMs = 1 * 60 * 1000,
  max = 3,
  message = "Too many requests, please try again later",
} = {}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message,
    },
  });
};

module.exports = createRateLimiter;
