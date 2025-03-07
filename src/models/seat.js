"use strict";
// const {
//   Model
// } = require('sequelize');
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Seat.belongsTo(models.Theater, {
        foreignKey: "theater_id",
        as: "theater",
      });
      Seat.hasMany(models.Reservation, {
        foreignKey: "seat_id",
        as: "reservations",
      });
    }
  }
  Seat.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      theater_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: "Theaters" },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      seat_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      seat_type: {
        type: DataTypes.ENUM("Vip", "Standard", "Couple"),
        allowNull: false,
        defaultValue: "Standard",
      },
      seat_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Seat",
      timestamps: true,
    }
  );
  return Seat;
};
