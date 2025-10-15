import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import handlebars from "handlebars";

dotenv.config();

// Get current file path and directory for loading template file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Sends an OTP verification email to the user with OTP and verification link.
 *
 * @param {string} email - Recipient's email address
 * @param {string} token - JWT token for OTP verification
 * @param {number} otp - One-time password (OTP) to verify user
 * @param {Date|string} otpExpired - Expiration time for the OTP
 */
const optVerifyEmail = async (email, token, otp, otpExpired) => {
  try {
    // Load the OTP email template (Handlebars)
    const templatePath = join(__dirname, "otp_template.hbs");
    const templateSource = fs.readFileSync(templatePath, "utf-8");

    // Compile the Handlebars template
    const template = handlebars.compile(templateSource);

    // Generate HTML content by injecting token, verification link, OTP, and expiry time
    const sendToHTML = template({
      token: encodeURIComponent(token), // URL-safe encoded token
      verified: `${process.env.BACKEND_URL}api/auth/otp/${encodeURIComponent(
        token
      )}`, // OTP verification URL
      otp, // One-time password for verification
      otpExpired, // OTP expiration time
    });

    // Configure Nodemailer transporter to send email via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false, // TLS without SSL on port 587
      auth: {
        user: process.env.USER_NAME, // Gmail user email
        pass: process.env.USER_PASSWORD, // Gmail app password or user password
      },
    });

    // Setup email options including recipient, subject, and content (text + HTML)
    const mailOptions = {
      from: process.env.USER_NAME,
      to: email,
      subject: "Verify your email",
      text: "Please verify your email by clicking the link.", // fallback plain text
      html: sendToHTML, // HTML formatted email with OTP and link
    };

    // Send the email asynchronously
    const info = await transporter.sendMail(mailOptions);

    // Log success response info
    console.log("Email sent: ", info.response);
  } catch (error) {
    // Log any error that occurs while sending email
    console.error("Error sending verification email:", error);
  }
};

export default optVerifyEmail;
