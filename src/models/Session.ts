import { DataTypes } from "sequelize";
import { sequelize } from "@/utils/database";
import User from "./User";

const Session = sequelize.define(
    'session',
    {
        'id': {
            type: DataTypes.TEXT,
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

export default Session;
