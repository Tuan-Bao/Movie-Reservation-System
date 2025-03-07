import db from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

const Seat = db.Seat;

export const getAllSeats = async () => {
  try {
    const seats = await Seat.findAll();
    const count = await Seat.count();
    if (!count) {
      throw new NotFoundError("No seats found");
    }
    return seats;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getSeatById = async (id) => {
  try {
    const seat = await Seat.findByPk(id);
    if (!seat) {
      throw new NotFoundError("Seat not found");
    }
    return seat;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createSeat = async ({
  theater_id,
  seat_number,
  seat_type,
  seat_price,
}) => {
  try {
    const existingSeat = await Seat.findOne({
      where: { theater_id, seat_number },
    });
    if (existingSeat) {
      throw new BadRequestError("Seat already exists");
    }

    const newSeat = await Seat.create({
      theater_id,
      seat_number,
      seat_type,
      seat_price,
    });

    return { message: "Seat created successfully", seat: newSeat };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateSeat = async (id, updateData) => {
  try {
    const seat = await Seat.findByPk(id);
    if (!seat) {
      throw new NotFoundError("Seat not found");
    }
    await seat.update({ ...updateData });
    return { message: "Seat updated successfully", seat };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteSeat = async (id) => {
  try {
    const seat = await Seat.findByPk(id);
    if (!seat) {
      throw new NotFoundError("Seat not found");
    }
    await seat.destroy();
    return { message: "Seat deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};
