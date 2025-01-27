import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (options) => {

  if (!options?.to) {
    console.error("Error: Recipient email (to) is required.");
    throw new Error("Recipient email (to) is required.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: "gmail",
    port: process.env.EMAIL_PORT,
    secure: process.env.SECURE === "true",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Conceptual Classes" <${process.env.GMAIL_USER}>`,
    to: options.to,
    subject: options.subject || "No Subject",
    text: options.text || "",
    html: options.html || "",
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw new Error("Failed to send email: " + error.message);
  }
};

export { sendEmail };
