import { Router } from "express";
import { methods as CarritoController } from "./../controllers/carrito.controller";

const router = Router();

router.post("/actualizaCarrito", CarritoController.actualizaCarrito);

export default router;