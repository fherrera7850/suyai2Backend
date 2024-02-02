import { Router } from "express";
import { methods as clienteController } from "./../controllers/cliente.controller";

const router = Router();

router.get("/getClientes", clienteController.getClientes);
router.get("/getCliente/:id", clienteController.getCliente);
router.post("/addCliente", clienteController.addCliente);
router.put("/updateCliente/:id", clienteController.updateCliente);
router.delete("/:id", clienteController.deleteCliente);

export default router;