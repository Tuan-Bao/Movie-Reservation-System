"use strict";
// const {
//   Model
// } = require('sequelize');
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Theater extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Theater.hasMany(models.Seat, {
        foreignKey: "theater_id",
        as: "seats",
      });
      Theater.hasMany(models.Showtime, {
        foreignKey: "theater_id",
        as: "showtimes",
      });
    }
  }
  Theater.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Theater",
      timestamps: true,
    }
  );
  return Theater;
};
