import { Router } from "express";
import { methods as productoVentaController } from "./../controllers/productoVenta.controller";

const router = Router();

router.post("/", productoVentaController.addProductoVenta);

export default router;