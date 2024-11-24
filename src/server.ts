import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "routes/auth.route"
import projectRoutes from "routes/project.route"
import { sequelize } from "utils/database";
import Session from "./models/Session";
import User from "./models/User";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());

// Custom Middlewares
app.use((request, _, next) => {
    console.log(request.path, request.method);
    next();
})

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (_, response) => {
    response.json({
        message: "Hello, World"
    })
})

// db auth, db sync and start server
sequelize
    .authenticate()
    .then(() => {
        // Associatoins
        Session.belongsTo(User, { foreignKey: 'user_id' });
        User.hasMany(Session);
        return sequelize.sync({ 
            force: process.env.DB_FORCE === "true",
            alter: process.env.DB_ALTER === "true"
        })
    })
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}.`);
        })
    })
    .catch((error: any) => {
        console.error("Unable to connect to database:", error);
    })

