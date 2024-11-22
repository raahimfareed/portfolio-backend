import express from "express";
import helmet from "helmet";
import cors from "cors";
import "dotenv/config";
import { sequelize } from "./database";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());

// Custom Middlewares
app.use((request, _, next) => {
    console.log(request.path, request.method);
    next();
})

app.get('/', (_, response) => {
    response.json({
        message: "Hello, World"
    })
})

// db auth and start server
sequelize
    .authenticate()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Listening on port ${process.env.PORT}.`);
        })
    })
    .catch((error) => {
        console.error("Unable to connect to database:", error);
    })

