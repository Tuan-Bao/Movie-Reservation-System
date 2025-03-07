import initDB from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";
import { sendOTP } from "../utils/gmail.js";
import { configDotenv } from "dotenv";

configDotenv({ path: "../.env" });

const db = await initDB();
const User = db.User;

export const register = async ({ username, email, password }) => {
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestError("Email already exists");
    }

    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const newUser = await User.create({
      username,
      email,
      password,
      otp_code,
      otp_expires_at,
    });

    const link = `${process.env.URL}/auth/verify?email=${email}&otp_code=${otp_code}`;
    await sendOTP(email, otp_code, "OTP Code Verification", link);
    return {
      message:
        "User created successfully, please check your email for verification.",
      user: newUser,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const verifyOTP = async ({ email, otp_code }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.is_verified) {
      throw new BadRequestError("User already verified");
    }

    if (user.otp_code !== otp_code) {
      throw new BadRequestError("Invalid OTP code");
    }

    if (user.otp_expires_at < new Date()) {
      throw new BadRequestError("OTP code has expired");
    }

    user.is_verified = true;
    user.otp_code = null;
    user.otp_expires_at = null;

    await user.save();

    return { message: "User verified successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!user.is_verified) {
      const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
      const otp_expires_at = new Date(Date.now() + 5 * 60 * 1000);

      user.otp_code = otp_code;
      user.otp_expires_at = otp_expires_at;
      await user.save();

      const link = `${process.env.URL}/auth/verify?email=${email}&otp_code=${otp_code}`;
      await sendOTP(email, otp_code, "OTP Code Verification", link);

      return { message: "Please check your email for verification." };
    } else {
      const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
      const otp_expires_at = new Date(Date.now() + 5 * 60 * 1000);

      user.otp_code = otp_code;
      user.otp_expires_at = otp_expires_at;
      await user.save();

      const link = `${process.env.URL}/auth/reset-password?email=${email}&otp_code=${otp_code}`;
      await sendOTP(email, otp_code, "OTP Code Reset Password", link);

      return { message: "Please check your email for reset password." };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const resetPassword = async ({ email, otp_code, new_password }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!user.is_verified) {
      throw new BadRequestError("User not verified");
    }

    if (user.otp_code !== otp_code) {
      throw new BadRequestError("Invalid OTP code");
    }

    if (user.otp_expires_at < new Date()) {
      throw new BadRequestError("OTP code has expired");
    }

    user.password = new_password;
    user.otp_code = null;
    user.otp_expires_at = null;

    await user.save();

    return { message: "Password reset successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const token = await user.createJWT();

    return { message: "Login successful", token, user };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllUsers = async () => {
  try {
    const users = await User.findAll();
    const count = await User.count();
    if (!count) {
      throw new NotFoundError("No users found");
    }
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }, // Không trả về password
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserProfile = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUser = async (id, updateData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (updateData.password) {
      throw new BadRequestError("Password cannot be updated");
    }

    await user.update({ ...updateData });
    return { message: "User updated successfully", user };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await user.destroy();
    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};
