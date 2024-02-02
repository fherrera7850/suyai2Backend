import { Router } from "express";
import { methods as productoController } from "./../controllers/producto.controller";

const router = Router();

router.get("/getProductos/:id", productoController.getProductos);
router.get("/getProducto/:id", productoController.getProducto);
router.post("/addProducto", productoController.addProducto);
router.put("/:id", productoController.updateProducto);
router.delete("/:id", productoController.deleteProducto);
router.get("/getProductosAdmin", productoController.getProductosAdmin);

export default router;