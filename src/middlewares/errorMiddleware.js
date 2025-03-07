import CustomError from "../errors/custom_error.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error("Unhandled error: ", err);
  return res
    .status(500)
    .json({ message: err.message || "Internal server error" });
};

export default errorMiddleware;
