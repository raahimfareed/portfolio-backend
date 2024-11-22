import { DataTypes } from "sequelize";
import { sequelize } from "@/database";

export const User = sequelize.define(
    'User',
    {
        'id': {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        'email': {
            type: DataTypes.STRING(127),
            allowNull: false
        },
        'password': {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
);
