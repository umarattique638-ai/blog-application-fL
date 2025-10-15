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
 * Sends a verification email to the user with a verification link.
 *
 * @param {string} email - Recipient's email address
 * @param {string} token - JWT token to verify user's email
 */
const userVerifyEmail = async (email, token) => {
  try {
    // Load the email template file (Handlebars template)
    const templatePath = join(__dirname, "email_template.hbs");
    const templateSource = fs.readFileSync(templatePath, "utf-8");

    // Compile the Handlebars template
    const template = handlebars.compile(templateSource);

    // Generate the HTML content by injecting dynamic variables into template
    const sendToHTML = template({
      token: encodeURIComponent(token), // encode token to be URL safe
      verified: `${
        process.env.FRONTEND_URL
      }/confirm-verification/${encodeURIComponent(token)}`, // verification URL
    });

    // Configure Nodemailer transporter for sending email using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false, // use TLS but not SSL (port 587)
      auth: {
        user: process.env.USER_NAME, // Gmail email address
        pass: process.env.USER_PASSWORD, // Gmail app password or real password
      },
    });

    // Define email options including recipient, subject and html content
    const mailOptions = {
      from: process.env.USER_NAME,
      to: email,
      subject: "Verify your email",
      text: "Please verify your email by clicking the link.", // plain text fallback
      html: sendToHTML, // HTML formatted email with link
    };

    // Send email asynchronously
    const info = await transporter.sendMail(mailOptions);

    // Log success message with response info
    console.log("Email sent: ", info.response);
  } catch (error) {
    // Log any errors occurred during sending email
    console.error("Error sending verification email:", error);
  }
};

export default userVerifyEmail;
