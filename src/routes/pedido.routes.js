import { Router } from "express";
import { methods as pedidoController } from "../controllers/pedido.controller";

const router = Router();

router.get("/", pedidoController.getPedidos);
router.get("/ResumenDiario", pedidoController.getResumenDiario);
router.get("/:_id", pedidoController.getPedido);
router.post("/CompletarPedido", pedidoController.CompletarPedido);
router.post("/CompletarPedido2", pedidoController.CompletarPedido2);
router.post("/CompletarPedidoRapido", pedidoController.CompletarPedidoRapido);
router.delete("/EliminarPedido", pedidoController.deletePedido)
router.post("/ActualizaPedidoPagado", pedidoController.actualizaVentaPagada)
export default router;