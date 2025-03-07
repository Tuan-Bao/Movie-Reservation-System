import { StatusCodes } from "http-status-codes";
import * as seatService from "../services/seatService.js";
import NotFoundError from "../errors/not_found.js";

export const getAllSeats = async (req, res, next) => {
  try {
    const seats = await seatService.getAllSeats();
    return res.status(StatusCodes.OK).json({ seats });
  } catch (error) {
    next(error);
  }
};

export const getSeatById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new NotFoundError("Missing required fields");
    }
    const seat = await seatService.getSeatById(id);
    return res.status(StatusCodes.OK).json({ seat });
  } catch (error) {
    next(error);
  }
};

export const createSeat = async (req, res, next) => {
  try {
    const { theater_id, seat_number, seat_type, seat_price } = req.body;
    if (!theater_id || !seat_number || !seat_type || !seat_price) {
      throw new NotFoundError("Missing required fields");
    }
    const newSeat = await seatService.createSeat({
      theater_id,
      seat_number,
      seat_type,
      seat_price,
    });
    return res
      .status(StatusCodes.CREATED)
      .json({ message: newSeat.message, seat: newSeat.seat });
  } catch (error) {
    next(error);
  }
};

export const updateSeat = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new NotFoundError("Missing required fields");
    }
    const updateData = req.body;
    const updateSeat = await seatService.updateSeat(id, updateData);
    return res
      .status(StatusCodes.OK)
      .json({ message: updateSeat.message, seat: updateSeat.seat });
  } catch (error) {
    next(error);
  }
};

export const deleteSeat = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new NotFoundError("Missing required fields");
    }
    const result = await seatService.deleteSeat(id);
    return res.status(StatusCodes.OK).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};
