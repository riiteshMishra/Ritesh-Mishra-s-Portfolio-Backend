// mujhe idea aaya ki error handler ek hona chahiye mujhe ye nhi pta ki
// ye code kaise kaam krega GPT ke help se kr rha hu
// future me is code ko samjhne ka try krunga

class AppError extends Error {
  constructor(message, statusCode, path) {
    super(message);
    this.statusCode = statusCode;
    this.path = path;
  }
}

module.exports = AppError;
