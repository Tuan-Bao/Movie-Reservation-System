import db from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

const Reservation = db.Reservation;
const User = db.User;
const Showtime = db.Showtime;
const Seat = db.Seat;

export const getAllReservations = async () => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Showtime,
          as: "showtime",
        },
        {
          model: Seat,
          as: "seat",
        },
      ],
    });
    return reservations;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getReservationById = async (id) => {
  try {
    const reservation = await Reservation.findByPk({
      id,
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Showtime,
          as: "showtime",
        },
        {
          model: Seat,
          as: "seat",
        },
      ],
    });
    if (!reservation) {
      throw new NotFoundError("Reservation not found");
    }
    return reservation;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getReservationByUser = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const user_id = user.id;
    const reservations = await Reservation.findAll({
      where: { user_id },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Showtime,
          as: "showtime",
        },
        {
          model: Seat,
          as: "seat",
        },
      ],
    });
    if (!reservations.length) {
      throw new NotFoundError("No reservations found");
    }
    return reservations;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createReservation = async ({
  user_id,
  showtime_id,
  seat_id,
  status,
}) => {
  const transaction = await db.sequelize.transaction();

  try {
    const showtime = await Showtime.findByPk(showtime_id, { transaction });
    if (!showtime) {
      throw new NotFoundError("Showtime not found");
    }

    const seat = await Seat.findByPk(seat_id, { transaction });
    if (!seat) {
      throw new NotFoundError("Seat not found");
    }

    if (seat.theater_id !== showtime.theater_id) {
      throw new BadRequestError(
        "Seat and showtime are not in the same theater"
      );
    }

    const existingReservation = await Reservation.findOne({
      where: { showtime_id, seat_id },
      transaction,
    });
    if (existingReservation) {
      throw new BadRequestError("Reservation already exists");
    }

    const newReservation = await Reservation.create(
      {
        user_id,
        showtime_id,
        seat_id,
        status,
      },
      { transaction }
    );
    await transaction.commit();
    return {
      message: "Reservation created successfully",
      reservation: newReservation,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const updateReservation = async (id, updateData) => {
  const transaction = await db.sequelize.transaction();
  try {
    const reservation = await Reservation.findByPk(id, { transaction });
    if (!reservation) {
      throw new NotFoundError("Reservation not found");
    }

    if (updateData.showtime_id) {
      const newShowtime = await Showtime.findByPk(updateData.showtime_id, {
        transaction,
      });
      if (!newShowtime) {
        throw new NotFoundError("Showtime not found");
      }
    }

    if (updateData.seat_id) {
      const newSeat = await Seat.findByPk(updateData.seat_id, { transaction });
      if (!newSeat) {
        throw new NotFoundError("Seat not found");
      }

      const targetShowtimeId =
        updateData.showtime_id || reservation.showtime_id;
      const targetShowtime = await Showtime.findByPk(targetShowtimeId, {
        transaction,
      });

      if (newSeat.theater_id !== targetShowtime.theater_id) {
        throw new BadRequestError(
          "Seat and showtime are not in the same theater"
        );
      }

      const seatAlreadyReserved = await Reservation.findOne({
        where: { showtime_id: targetShowtimeId, seat_id: updateData.seat_id },
        transaction,
      });
      if (seatAlreadyReserved) {
        throw new BadRequestError("Seat is already reserved");
      }
    }

    await reservation.update({ ...updateData }, { transaction });
    await transaction.commit();
    return { message: "Reservation updated successfully", reservation };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const cancelReservation = async (id, user_id) => {
  try {
    const reservation = await Reservation.findOne({ where: { id, user_id } });
    if (!reservation) {
      throw new NotFoundError("Reservation not found");
    }
    const showtime = await Showtime.findByPk(reservation.showtime_id);
    if (new Date(showtime.start_time) < new Date()) {
      throw new BadRequestError("Showtime has already started");
    }
    await reservation.update({ status: "cancelled" });
    return { message: "Reservation cancelled successfully", reservation };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteReservation = async (id) => {
  try {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      throw new NotFoundError("Reservation not found");
    }
    await reservation.destroy();
    return { message: "Reservation deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const calculateReservationAmount = async (id) => {
  try {
    // const reservation = await Reservation.findByPk(id);
    // if (!reservation) {
    //   throw new NotFoundError("Reservation not found");
    // }

    // const showtime_id = reservation.showtime_id;
    // const seat_id = reservation.seat_id;

    // const showtime = await Showtime.findByPk(showtime_id);
    // if (!showtime) {
    //   throw new NotFoundError("Showtime not found");
    // }

    // const seat = await Seat.findByPk(seat_id);
    // if (!seat) {
    //   throw new NotFoundError("Seat not found");
    // }

    // const amount = showtime.ticket_price + seat.seat_price;
    // return {
    //   id,
    //   toatal_amount: amount,
    // };

    const reservation = await Reservation.findOne({
      where: { id },
      include: [
        {
          model: Showtime,
          as: "showtime",
          attributes: ["ticket_price"],
        },
        {
          model: Seat,
          as: "seat",
          attributes: ["seat_price"],
        },
      ],
    });

    if (!reservation) {
      throw new NotFoundError("Reservation not found");
    }

    const amount =
      reservation.showtime.ticket_price + reservation.seat.seat_price;
    return {
      id,
      total_amount: amount,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
