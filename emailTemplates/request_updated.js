// email HTML generator - emoji version
exports.requestUpdate = (email, status) => {
  const statusMessageMap = {
    resolved:
      "Your request has been <strong style='color:green;'>resolved</strong> ✅",
    rejected:
      "Unfortunately, your request has been <strong style='color:red;'>rejected</strong> ❌",
    pending:
      "Your request is still <strong style='color:orange;'>pending</strong> ⏳",
  };

  const message =
    statusMessageMap[status] || "Your request status has been updated. ℹ️";

  const html = `
  <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); color: #333;">
    <h1 style="color: #4CAF50; margin-bottom: 10px; text-align: center;">  Request Update</h1>
    <p style="font-size: 16px;">Hello,</p>
    <p style="font-size: 16px; line-height: 1.6;">
      We wanted to update you regarding your request:
    </p>

    <div style="margin: 20px 0; padding: 15px; background: #fff; border-left: 5px solid #4CAF50; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
      <p style="font-size: 16px; line-height: 1.5;">${message}</p>
    </div>

    <p style="font-size: 16px; line-height: 1.5;">
      For more details, you can check your request status in your account:
    </p>

    <div style="text-align: center; margin: 25px 0;">
      <a href="https://ritesh-mishra-s-portfolio-frondtend.vercel.app/" style="background: #4CAF50; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 8px; font-weight: bold; display: inline-block;">🔍 View Request</a>
    </div>

    <hr style="border:none; border-top:1px solid #eee; margin: 20px 0;" />

    <p style="font-size: 12px; color: #777; text-align: center;">
      This email was sent from: <strong>${email}</strong> <br />
      Visit our portfolio: <a href="https://ritesh-mishra-s-portfolio-frondtend.vercel.app/" style="color:#4CAF50;">https://ritesh-mishra-s-portfolio-frondtend.vercel.app/</a>
    </p>

    <p style="font-size: 12px; color: #777; text-align: center; margin-top: 5px;">
      If you have any questions, feel free to contact our support team at 
      <a href="mailto:riteshmishra.dev@gmail.com" style="color:#4CAF50;">📧 riteshmishra.dev@gmail.com</a> 
      or call us at <a href="tel:+919565672752" style="color:#4CAF50;">📞 +91 9565672752</a>.
    </p>
  </div>
  `;

  return html;
};
