import { DataTypes } from "sequelize";
import { sequelize } from "@/database";
import { User } from "./User";

export const Session = sequelize.define(
    'session',
    {
        'id': {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        'user_id': {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        'expires_at': {
            type: DataTypes.DATE,
        }
    },
);
