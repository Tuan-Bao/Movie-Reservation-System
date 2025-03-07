import initDB from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

const db = await initDB();
const Theater = db.Theater;
const Seat = db.Seat;

export const getAllTheaters = async () => {
  try {
    const theaters = await Theater.findAll();
    const count = await Theater.count();
    if (!count) {
      throw new NotFoundError("No theaters found");
    }
    return theaters;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTheaterById = async (id) => {
  try {
    const theater = await Theater.findByPk(id);
    if (!theater) {
      throw new NotFoundError("Theater not found");
    }
    return theater;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createTheater = async ({ name }) => {
  try {
    const existingTheater = await Theater.findOne({ where: { name } });
    if (existingTheater) {
      throw new BadRequestError("Theater already exists");
    }
    const newTheater = await Theater.create({ name });
    return { message: "Theater created successfully", theater: newTheater };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateTheater = async (id, updateData) => {
  try {
    const theater = await Theater.findByPk(id);
    if (!theater) {
      throw new NotFoundError("Theater not found");
    }
    await theater.update({ ...updateData });
    return { message: "Theater updated successfully", theater };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteTheater = async (id) => {
  try {
    const theater = await Theater.findByPk(id);
    if (!theater) {
      throw new NotFoundError("Theater not found");
    }

    await theater.destroy();
    return { message: "Theater deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getSeatsByTheaterName = async (name) => {
  try {
    // const theater = await Theater.findOne({ where: { name } });
    // if (!theater) {
    //   throw new NotFoundError("Theater not found");
    // }
    // const theater_id = theater.id;
    // const seats = await Seat.findAll({ where: { theater_id } });
    // const count = await Seat.count({ where: { theater_id } });
    // if (!count) {
    //   throw new NotFoundError("No seats found");
    // }
    // return seats;

    const theaterWithSeats = await Theater.findOne({
      where: { name },
      include: [
        {
          model: Seat,
          as: "seats",
          required: false, // Nếu theater có nhưng không có seat, vẫn trả về theater
        },
      ],
    });

    if (!theaterWithSeats) {
      throw new NotFoundError("Theater not found");
    }

    if (!theaterWithSeats.seats.length) {
      throw new NotFoundError("No seats found in this theater");
    }

    return theaterWithSeats.seats;
  } catch (error) {
    throw new Error(error.message);
  }
};
