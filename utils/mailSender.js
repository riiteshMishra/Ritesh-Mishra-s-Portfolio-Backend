require("dotenv").config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.mailSender = async (email, title, body) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent successfully via Resend API");
    return response;
  } catch (error) {
    console.error("Failed to send email via Resend API:", error);
    throw new Error("Email sending failed");
  }
};

/**
 * Mail Sender Utility
 * --------------------
 * Mai switch kr rha hu smtp.gmail.com --> resend apis
 * Reason: Render/Vercel SMTP + Resend uses HTTPS (443) → works everywhere
 */