import { sequelize } from "@/utils/database";
import { DataTypes } from "sequelize";

const Project = sequelize.define(
    'Project', {
        'id': {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        'name': {
            type: DataTypes.STRING,
            allowNull: false
        },
        'description': {
            type: DataTypes.TEXT,
            allowNull: false
        },
        'image': {
            type: DataTypes.STRING,
            allowNull: false,
        },
        'url': {
            type: DataTypes.STRING,
            allowNull: true
        },
        'techStack': {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        }
    })

export default Project
