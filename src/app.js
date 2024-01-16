import express from "express";
import morgan from "morgan";
// Routes
import productoRoutes from "./routes/producto.routes";

const app = express();

// Settings
app.set("port", process.env.PORT || 4000);


// Middlewares
app.use(morgan("dev"));
app.use(express.json({limit: "50mb", extended: true}))
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}))

// Routes
app.use("/api/producto", productoRoutes);

export default app;
