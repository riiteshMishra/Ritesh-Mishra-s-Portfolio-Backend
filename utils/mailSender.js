const nodemailer = require("nodemailer");

exports.mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MailHost,
      port: 465,
      secure: process.env.MailSecure === "true",
      auth: {
        user: process.env.MailUser,
        pass: process.env.MailPass,
      },
    });

    let info = await transporter.sendMail({
      from: ` <${process.env.MailUser}>`,
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
