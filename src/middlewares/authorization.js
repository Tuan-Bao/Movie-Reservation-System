import NotFoundError from "../errors/not_found.js";
import ForbiddenError from "../errors/forbidden.js";
import db from "../models/index.js";

const User = db.User;

const authorization = (roles) => async (req, res, next) => {
  try {
    const id = req.user.id;
    const user = await User.findByPk(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (!roles.includes(user.role)) {
      throw new ForbiddenError("Access denied");
    }
    next();
  } catch (error) {
    throw new Error(error.message);
  }
};

export default authorization;
