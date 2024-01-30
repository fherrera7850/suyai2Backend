import { Router } from "express";
import { methods as pedidoController } from "./../controllers/pedido.controller";

const router = Router();

router.get("/getPedidos", pedidoController.getPedidos);
router.get("/getPedido/:id", pedidoController.getPz);
router.post("/addPedidoo", pedidoController.addProducto);
router.put("/:id", pedidoController.updateProducto);
router.delete("/:id", pedidoController.deleteProducto);

export default router;