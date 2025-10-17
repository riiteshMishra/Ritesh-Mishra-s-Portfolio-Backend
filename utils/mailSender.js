const nodemailer = require("nodemailer");

exports.mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      logger: true,
      debug: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: ` <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Mail sent: ", info.messageId);
    return info;
  } catch (err) {
    console.error("Mail sending error:", err);
    throw new Error("Failed to send email");
  }
};
