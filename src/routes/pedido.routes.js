import { Router } from "express";
import { methods as pedidoController } from "./../controllers/pedido.controller";

const router = Router();

router.get("/getPedidos/:id", pedidoController.getPedidos);
router.get("/getPedido/:id", pedidoController.getPedido);
router.get("/getDetallePedido/:id", pedidoController.getDetallePedido);
router.post("/addPedido", pedidoController.addPedido);
router.put("/:id", pedidoController.updatePedido);
router.delete("/:id", pedidoController.deletePedido);
router.post("/completaPedido", pedidoController.completaPedido);
router.get("/getPedidoById/:id", pedidoController.getPedidoById);

export default router;