import { StatusCodes } from "http-status-codes";
import * as movieService from "../services/movieService.js";
import NotFoundError from "../errors/not_found.js";

export const getAllMovies = async (req, res, next) => {
  try {
    const movies = await movieService.getAllMovies();
    return res.status(StatusCodes.OK).json({ movies });
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await movieService.getMovieById(id);
    return res.status(StatusCodes.OK).json({ movie });
  } catch (error) {
    next(error);
  }
};

export const createMovie = async (req, res, next) => {
  try {
    const { title, description, genre, duration, poster_url } = req.body;
    if (!title || !description || !genre || !duration || !poster_url) {
      throw new NotFoundError("Missing required fields");
    }
    const movie = await movieService.createMovie({
      title,
      description,
      genre,
      duration,
      poster_url,
    });
    return res
      .status(StatusCodes.CREATED)
      .json({ message: movie.message, movie: movie.movie });
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updateMovie = await movieService.updateMovie(id, updateData);
    return res
      .status(StatusCodes.OK)
      .json({ message: updateMovie.message, movie: updateMovie.movie });
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await movieService.deleteMovie(id);
    return res.status(StatusCodes.OK).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export const calculateMovieRevenue = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new NotFoundError("Missing required fields");
    }

    const revenue = await movieService.calculateMovieRevenue(id);
    return res.status(StatusCodes.OK).json({
      movie_id: revenue.movie_id,
      total_revenue: revenue.total_revenue,
    });
  } catch (error) {
    next(error);
  }
};
