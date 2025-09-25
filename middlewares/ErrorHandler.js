// mujhe idea aaya ki error handler ek hona chahiye mujhe ye nhi pta ki
// ye code kaise kaam krega GPT ke help se kr rha hu
// future me is code ko samjhne ka try krunga

// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error("ERROR LOG:", err);

  // agar request API se aa rahi hai (JSON) to JSON bhejo
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      path: err.path || req.originalUrl,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // agar browser me direct hit ho to HTML bhejo
  res.status(err.statusCode || 500).send(`
    <html>
      <head><title>Error</title></head>
      <body style="font-family:Arial,sans-serif; background:#f9f9f9; padding:20px;">
        <h2 style="color:red;">Error: ${err.message}</h2>
        <p>Path: ${err.path || req.originalUrl}</p>
        <pre>${process.env.NODE_ENV === 'development' ? err.stack : ''}</pre>
      </body>
    </html>
  `);
};
