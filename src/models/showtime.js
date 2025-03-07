"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Showtime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Showtime.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        as: "movie",
      });
      Showtime.belongsTo(models.Theater, {
        foreignKey: "theater_id",
        as: "theater",
      });
      Showtime.hasMany(models.Reservation, {
        foreignKey: "showtime_id",
        as: "reservations",
      });
    }
  }
  Showtime.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: "movies" },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      theater_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: { tableName: "theaters" },
          key: "id",
        },
        onDelete: "CASCADE",
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ticket_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Showtime",
      timestamps: true,
    }
  );
  return Showtime;
};
