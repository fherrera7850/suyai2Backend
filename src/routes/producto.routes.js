import { Router } from "express";
import { methods as productoController } from "./../controllers/producto.controller";

const router = Router();

router.get("/", productoController.getProductos);

export default router;