import { StatusCodes } from "http-status-codes";
import * as showtimeService from "../services/showtimeService.js";
import NotFoundError from "../errors/not_found.js";

export const getAllShowtimes = async (req, res, next) => {
  try {
    const showtimes = await showtimeService.getAllShowtimes();
    return res.status(StatusCodes.OK).json({ showtimes });
  } catch (error) {
    next(error);
  }
};

export const getShowTimeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new NotFoundError("Missing required fields");
    }
    const showtime = await showtimeService.getShowTimeById(id);
    return res.status(StatusCodes.OK).json({ showtime });
  } catch (error) {
    next(error);
  }
};

export const getShowTimesByMovieTitle = async (req, res, next) => {
  try {
    const { title } = req.params;
    if (!title) {
      throw new NotFoundError("Missing required fields");
    }
    const showtimes = await showtimeService.getShowTimesByMovieTitle(title);
    return res.status(StatusCodes.OK).json({ showtimes });
  } catch (error) {
    next(error);
  }
};

export const createShowTime = async (req, res, next) => {
  try {
    const { movie_id, theater_id, start_time, ticket_price } = req.body;
    if (!movie_id || !theater_id || !start_time || !ticket_price) {
      throw new NotFoundError("Missing required fields");
    }
    const showtime = await showtimeService.createShowTime({
      movie_id,
      theater_id,
      start_time,
      ticket_price,
    });
    return res
      .status(StatusCodes.CREATED)
      .json({ message: showtime.message, showtime: showtime.showtime });
  } catch (error) {
    next(error);
  }
};

export const updateShowTime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updateShowTime = await showtimeService.updateShowTime(id, updateData);
    return res.status(StatusCodes.OK).json({
      message: updateShowTime.message,
      showtime: updateShowTime.showtime,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteShowTime = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new NotFoundError("Missing required fields");
    }
    const result = await showtimeService.deleteShowTime(id);
    return res.status(StatusCodes.OK).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export const calculateShowtimeRevenue = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new NotFoundError("Missing required fields");
    }

    const revenue = await showtimeService.calculateShowtimeRevenue(id);
    return res.status(StatusCodes.OK).json({
      showtime_id: revenue.showtime_id,
      total_revenue: revenue.total_revenue,
    });
  } catch (error) {
    next(error);
  }
};
