import { Router } from "express";
import { methods as adminController } from "./../controllers/admin.controller";

const router = Router();

router.get("/getClientes", adminController.getClientes);
router.get("/getAdmin/:id", adminController.getAdmin);
router.post("/addCliente", adminController.addCliente);
router.put("/:id", adminController.updateCliente);
router.delete("/:id", adminController.deleteCliente);

export default router;