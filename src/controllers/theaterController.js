import { StatusCodes } from "http-status-codes";
import * as theaterService from "../services/theaterService.js";
import NotFoundError from "../errors/not_found.js";

export const getAllTheaters = async (req, res, next) => {
  try {
    const theaters = await theaterService.getAllTheaters();
    return res.status(StatusCodes.OK).json({ theaters });
  } catch (error) {
    next(error);
  }
};

export const getTheaterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const theater = await theaterService.getTheaterById(id);
    return res.status(StatusCodes.OK).json({ theater });
  } catch (error) {
    next(error);
  }
};

export const createTheater = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new NotFoundError("Missing required fields");
    }
    const theater = await theaterService.createTheater({ name });
    return res
      .status(StatusCodes.CREATED)
      .json({ message: theater.message, theater: theater.theater });
  } catch (error) {
    next(error);
  }
};

export const updateTheater = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updateTheater = await theaterService.updateTheater(id, updateData);
    return res
      .status(StatusCodes.OK)
      .json({ message: updateTheater.message, theater: updateTheater.theater });
  } catch (error) {
    next(error);
  }
};

export const deleteTheater = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await theaterService.deleteTheater(id);
    return res.status(StatusCodes.OK).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export const getSeatsByTheaterName = async (req, res, next) => {
  try {
    const { name } = req.params;
    if (!name) {
      throw new NotFoundError("Missing required fields");
    }
    const seats = await theaterService.getSeatsByTheaterName(name);
    return res.status(StatusCodes.OK).json({ seats });
  } catch (error) {
    next(error);
  }
};
