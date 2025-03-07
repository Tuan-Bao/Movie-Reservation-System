import db from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

const Movie = db.Movie;
const Reservation = db.Reservation;
const Showtime = db.Showtime;
const Seat = db.Seat;

export const getAllMovies = async () => {
  try {
    const movies = await Movie.findAll();
    const count = await Movie.count();
    if (!count) {
      throw new NotFoundError("No movies found");
    }
    return movies;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMovieById = async (id) => {
  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }
    return movie;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createMovie = async ({
  title,
  description,
  genre,
  duration,
  poster_url,
}) => {
  try {
    const existingMovie = await Movie.findOne({ where: { title } });
    if (existingMovie) {
      throw new BadRequestError("Movie already exists");
    }

    const newMovie = await Movie.create({
      title,
      description,
      genre,
      duration,
      poster_url,
    });
    return { message: "Movie created successfully", movie: newMovie };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateMovie = async (id, updateData) => {
  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }
    await movie.update({ ...updateData });
    return { message: "Movie updated successfully", movie };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteMovie = async (id) => {
  try {
    const movie = await Movie.findByPk(id);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }
    await movie.destroy();
    return { message: "Movie deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const calculateMovieRevenue = async (movie_id) => {
  try {
    const movie = await Movie.findByPk(movie_id);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    const revenue = await Reservation.findAll({
      include: [
        {
          model: Showtime,
          as: "showtime",
          where: { movie_id },
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
      movie_id,
      total_revenue: revenue[0].total_revenue || 0,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
