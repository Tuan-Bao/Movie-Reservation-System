"use strict";
// const {
//   Model
// } = require('sequelize');
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Model } from "sequelize";
import BadRequestError from "../errors/bad_request.js";
import { configDotenv } from "dotenv";

configDotenv({ path: "../.env" });

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Reservation, {
        foreignKey: "userId",
        as: "reservations",
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      otp_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otp_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // createdAt: {
      //   allowNull: false,
      //   type: DataTypes.DATE,
      //   defaultValue: Sequelize.NOW,
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: DataTypes.DATE,
      //   defaultValue: Sequelize.NOW,
      // },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true, // Bật createdAt và updatedAt
    }
  );

  User.beforeSave(async (user) => {
    if (user.changed("password")) {
      const value = user.password;

      if (value.length < 8 || value.length > 32) {
        throw new BadRequestError(
          "Password must be between 8 and 32 characters."
        );
      }

      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?\/\\|-]/.test(value);

      if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        throw new BadRequestError(
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.prototype.createJWT = function () {
    // console.log(process.env.JWT_SECRET);
    return jwt.sign(
      { id: this.id, username: this.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  };

  User.prototype.comparePassword = async function (cadidatePassword) {
    const isMatch = await bcrypt.compare(cadidatePassword, this.password);
    return isMatch;
  };

  return User;
};
