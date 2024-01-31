import express from "express";
import morgan from "morgan";
import cors from "cors";

// Routes
import productoRoutes from "./routes/producto.routes";
//import productoRoutes from "./routes/cliente.routes";
//import productoRoutes from "./routes/admin.routes";
import registroRoutes from "./routes/registro.routes";
import loginRoutes from "./routes/login.routes";
import carritoRoutes from "./routes/carrito.routes";
import pedidoRoutes from "./routes/pedido.routes";

const app = express();
// Settings
app.set("port", process.env.PORT || 4000);


// Middlewares
app.use(morgan("dev"));
app.use(express.json({limit: "50mb", extended: true}))
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}))
app.use(cors());
// Routes
app.use("/api/producto", productoRoutes);
//app.use("/api/cliente", productoRoutes);
//app.use("/api/admin", productoRoutes);
app.use("/api/registro", registroRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/pedido", pedidoRoutes);

export default app;
