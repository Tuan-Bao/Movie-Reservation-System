import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import UnauthorizedError from "../errors/unauthorized.js";

configDotenv({ path: "../.env" });

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Unauthorized");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };
    next();
  } catch (error) {
    throw new UnauthorizedError("Unauthorized");
  }
};

export default authentication;
