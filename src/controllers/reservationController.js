import { StatusCodes } from "http-status-codes";
import * as reservationService from "../services/reservationService.js";
import NotFoundError from "../errors/not_found.js";

export const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await reservationService.getAllReservations();
    return res.status(StatusCodes.OK).json({ reservations });
  } catch (error) {
    next(error);
  }
};

export const getReservationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new NotFoundError("Missing required fields");
    }
    const reservation = await reservationService.getReservationById(id);
    return res.status(StatusCodes.OK).json({ reservation });
  } catch (error) {
    next(error);
  }
};

export const getReservationByUser = async (req, res, next) => {
  try {
    const id = req.user.id;
    const reservations = await reservationService.getReservationByUser(id);
    return res.status(StatusCodes.OK).json({ reservations });
  } catch (error) {
    next(error);
  }
};

export const createReservation = async (req, res, next) => {
  try {
    const { user_id, showtime_id, seat_id, status } = req.body;
    if (!user_id || !showtime_id || !seat_id || !status) {
      throw new NotFoundError("Missing required fields");
    }
    const newReservation = await reservationService.createReservation({
      user_id,
      showtime_id,
      seat_id,
      status,
    });
    return res.status(StatusCodes.CREATED).json({
      message: newReservation.message,
      reservation: newReservation.reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updateReservation = await reservationService.updateReservation(
      id,
      updateData
    );
    return res.status(StatusCodes.OK).json({
      message: updateReservation.message,
      reservation: updateReservation.reservation,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    if (!id || !user_id) {
      throw new NotFoundError("Missing required fields");
    }
    const result = await reservationService.cancelReservation(id, user_id);
    return res.status(StatusCodes.OK).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export const deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new NotFoundError("Missing required fields");
    }
    const result = await reservationService.deleteReservation(id);
    return res.status(StatusCodes.OK).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export const calculateReservationAmount = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new NotFoundError("Missing required fields");
    }
    const amount = await reservationService.calculateReservationAmount(id);
    return res
      .status(StatusCodes.OK)
      .json({ reservation_id: amount.id, total_amount: amount.total_amount });
  } catch (error) {
    next(error);
  }
};
