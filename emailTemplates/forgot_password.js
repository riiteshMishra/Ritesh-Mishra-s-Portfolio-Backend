require("dotenv").config()
exports.forgotPasswordTemplate = (email, token) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f6fb; margin: 0; padding: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6fb; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0px 2px 6px rgba(0,0,0,0.1);">
              <tr>
                <td align="center" style="padding: 20px;">
                  <h2 style="color: #333;">Password Reset Request</h2>
                  <p style="color: #555;">Hello <b>${email}</b>,</p>
                  <p style="color: #555;">
                    We received a request to reset your password. Click the button below to reset it. 
                    This link will expire in <b>10 minutes</b>.
                  </p>
                  <a href="${process.env.FRONTEND_URL}/reset-password/${token}"
                    style="display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                    Reset Password
                  </a>
                  <p style="color: #555;">If you didn’t request this, you can safely ignore this email.</p>
                  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
                  <p style="color: #999; font-size: 12px;">
                    © ${new Date().getFullYear()} ${process.env.FRONTEND_URL} . All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
