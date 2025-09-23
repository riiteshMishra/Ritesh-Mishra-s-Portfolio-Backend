// utils/otpTemplate.js
exports.signUpOtpTemplate = (email, otp) => {
  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>Your OTP Code</title>
    </head>
    <body style="margin:0; padding:20px; background:#f4f6fb; font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:500px; margin:auto; background:#ffffff; border-radius:12px; padding:24px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        
        <h2 style="text-align:center; color:#111827; font-size:20px; font-weight:600;">
          🔐 Verify Your Email
        </h2>
        
        <p style="text-align:center; color:#374151; font-size:14px; margin-top:12px;">
          Hi <strong>${email}</strong>, use the OTP below to verify your email.  
          This code will expire in <strong>5 minutes</strong>.
        </p>
        
        <div style="text-align:center; margin:20px 0;">
          <span style="display:inline-block; background:#4f46e5; color:white; font-size:24px; font-weight:bold; letter-spacing:6px; padding:12px 24px; border-radius:8px;">
            ${otp}
          </span>
        </div>

        <p style="color:#6b7280; font-size:12px; text-align:center; margin-top:20px;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
    </body>
  </html>
  `;
};
