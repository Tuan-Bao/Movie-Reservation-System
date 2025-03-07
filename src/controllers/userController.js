import { StatusCodes } from "http-status-codes";
import * as userService from "../services/userService.js";
import NotFoundError from "../errors/not_found.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new NotFoundError("Missing required fields");
    }
    const result = await userService.register({ username, email, password });
    return res
      .status(StatusCodes.CREATED)
      .json({ message: result.message, user: result.user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new NotFoundError("Missing required fields");
    }
    const result = await userService.loginUser({ email, password });
    return res
      .status(StatusCodes.OK)
      .json({ message: result.message, token: result.token });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await userService.getUserProfile(id);
    return res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updateUser = await userService.updateUser(id, updateData);
    return res
      .status(StatusCodes.OK)
      .json({ message: updateUser.message, user: updateUser.user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    return res.status(StatusCodes.OK).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp_code } = req.query;
    const result = await userService.verifyOTP({ email, otp_code });
    return res.status(StatusCodes.OK).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

// ?
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new NotFoundError("Missing required fields");
    }
    const result = await userService.forgotPassword({ email });
    return res.status(StatusCodes.OK).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp_code } = req.query;
    const { new_password } = req.body;

    if (!email || !otp_code || !new_password) {
      throw new NotFoundError("Missing required fields");
    }
    const result = await userService.resetPassword({
      email,
      otp_code,
      new_password,
    });
    return res.status(StatusCodes.OK).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};
