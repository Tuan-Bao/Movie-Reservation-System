import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/userRouter.js";
import movieRouter from "./routes/movieRouter.js";
import theaterRouter from "./routes/theaterRouter.js";
import seatRouter from "./routes/seatRouter.js";
import showtimeRouter from "./routes/showtimeRouter.js";
import reservationRouter from "./routes/reservationRouter.js";
import { configDotenv } from "dotenv";

configDotenv({ path: "src/.env" });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/theaters", theaterRouter);
app.use("/api/seats", seatRouter);
app.use("/api/showtimes", showtimeRouter);
app.use("/api/reservations", reservationRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
