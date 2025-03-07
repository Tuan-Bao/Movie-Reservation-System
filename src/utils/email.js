import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv({ path: "../.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendOTP = async (email, otp_code, subject, link) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: `
        <p>Hello</p>
        <p>Your OTP code is: <strong>${otp_code}</strong>. OTP Code is valid for 5 minutes.</p>
        <a href="${link} style="background-color: #008CBA; padding: 10px; color: white; text-decoration: none; border-radius: 5px;">Click here to verify</a>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        throw new Error(error.message);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
