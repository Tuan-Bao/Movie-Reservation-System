"use strict";
// const {
//   Model
// } = require('sequelize');
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservation.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Reservation.belongsTo(models.Showtime, {
        foreignKey: "showtime_id",
        as: "showtime",
      });
      Reservation.belongsTo(models.Seat, {
        foreignKey: "seat_id",
        as: "seat",
      });
    }
  }
  Reservation.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: "Users" },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      showtime_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: "Showtimes" },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      seat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: "Seats" },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      status: {
        type: DataTypes.ENUM("confirmed", "cancelled"),
        allowNull: false,
        defaultValue: "confirmed",
      },
    },
    {
      sequelize,
      modelName: "Reservation",
      timestamps: true,
    }
  );
  return Reservation;
};
