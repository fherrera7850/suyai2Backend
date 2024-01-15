import { Router } from "express";
import { methods as pedidoVentaController } from "../controllers/pedidoVenta.controller";

const router = Router();

router.post("/CompletaPedidoVenta", pedidoVentaController.CompletaPedidoVenta);

export default router;