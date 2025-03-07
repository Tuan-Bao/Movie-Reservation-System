import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv({ path: "../.env" });

// console.log(process.env.EMAIL, process.env.PASSWORD);

export const sendOTP = async (email, otp_code, subject, link) => {
  const transporter = nodemailer.createTransport({
    // service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: `
        <p>Hello</p>
        <p>Your OTP code is: <strong>${otp_code}</strong>. OTP Code is valid for 5 minutes.</p>
        <a href="${link}>Click here to verify</a>
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
