exports.clientRequest = (data) => {
  const {
    firstName,
    lastName,
    email,
    contactNumber,
    message,
    createdAt,
    status,
  } = data;

  const formattedDate = new Date(createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f4f8; padding: 20px; border-radius: 10px;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #1a73e8; margin-bottom: 10px;">📬 New Contact Request Received</h2>
        <p style="color: #555;">You have a new request submitted via the contact form.</p>

        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #333;">Name:</td>
            <td style="padding: 8px; color: #555;">${firstName} ${lastName}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #333;">Email:</td>
            <td style="padding: 8px; color: #555;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #333;">Contact Number:</td>
            <td style="padding: 8px; color: #555;">${contactNumber}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #333;">Message:</td>
            <td style="padding: 8px; color: #555;">${message}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; color: #333;">Status:</td>
            <td style="padding: 8px; color: #555;">${status}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold; color: #333;">Submitted on:</td>
            <td style="padding: 8px; color: #555;">${formattedDate}</td>
          </tr>
        </table>

        <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
          This is an automated message from your website. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  return htmlContent;
};
