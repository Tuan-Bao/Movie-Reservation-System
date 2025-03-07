import initDB from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

const db = await initDB();
const Showtime = db.Showtime;
const Movie = db.Movie;
const Reservation = db.Reservation;
const Seat = db.Seat;

export const getAllShowtimes = async () => {
  try {
    const showtimes = await Showtime.findAll();
    const count = await Showtime.count();
    if (!count) {
      throw new NotFoundError("No showtimes found");
    }
    return showtimes;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getShowTimeById = async (id) => {
  try {
    const showtime = await Showtime.findByPk(id);
    if (!showtime) {
      throw new NotFoundError("Showtime not found");
    }
    return showtime;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getShowTimesByMovieTitle = async (title) => {
  try {
    const movie = await Movie.findOne({ where: { title } });
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }
    const movie_id = movie.id;
    const showtimes = await Showtime.findAll({ where: { movie_id } });
    const count = await Showtime.count({ where: { movie_id } });
    if (!count) {
      throw new NotFoundError("No showtimes found");
    }
    return showtimes;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createShowTime = async ({
  movie_id,
  theater_id,
  start_time,
  ticket_price,
}) => {
  try {
    const movie = await Movie.findByPk(movie_id);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    const existingShowtime = await Showtime.findOne({
      where: {
        movie_id,
        theater_id,
        start_time,
      },
    });
    if (existingShowtime) {
      throw new BadRequestError("Showtime already exists");
    }

    const startTimeDate = new Date(start_time);
    const endTimeDate = new Date(
      startTimeDate.getTime() + movie.duration * 60000
    );

    const newShowtime = await Showtime.create({
      movie_id,
      theater_id,
      start_time,
      end_time: endTimeDate.toISOString(),
      ticket_price,
    });
    return { message: "Showtime created successfully", showtime: newShowtime };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateShowTime = async (id, updateData) => {
  try {
    const showtime = await Showtime.findByPk(id);
    if (!showtime) {
      throw new NotFoundError("Showtime not found");
    }

    const movie_id = showtime.movie_id;
    const movie = await Movie.findByPk(movie_id);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    if (updateData.start_time) {
      const startTimeDate = new Date(updateData.start_time);
      const endTimeDate = new Date(
        startTimeDate.getTime() + movie.duration * 60000
      );
      updateData.end_time = endTimeDate.toISOString();
    }

    await showtime.update({ ...updateData });
    return { message: "Showtime updated successfully", showtime };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteShowTime = async (id) => {
  try {
    const showtime = await Showtime.findByPk(id);
    if (!showtime) {
      throw new NotFoundError("Showtime not found");
    }
    await showtime.destroy();
    return { message: "Showtime deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const calculateShowtimeRevenue = async (showtime_id) => {
  try {
    const showtime = await Showtime.findByPk(showtime_id);
    if (!showtime) {
      throw new NotFoundError("Showtime not found");
    }

    const revenue = await Reservation.findAll({
      where: { showtime_id },
      include: [
        {
          model: Showtime,
          as: "showtime",
          attributes: [],
        },
        {
          model: Seat,
          as: "seat",
          attributes: [],
        },
      ],
      attributes: [
        [
          db.Sequelize.fn(
            "SUM",
            db.Sequelize.literal("showtime.ticket_price + seat.seat_price")
          ),
          "total_revenue",
        ],
      ],
      raw: true,
    });

    return {
      showtime_id,
      total_revenue: revenue[0].total_revenue || 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
