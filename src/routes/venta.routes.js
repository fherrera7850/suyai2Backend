import { Router } from "express";
import { methods as ventaController } from "./../controllers/venta.controller";

const router = Router();

router.post("/", ventaController.addVenta);
router.get("/Historial", ventaController.getHistorial30Dias);

router.get("/Estadisticas/:FechaInicio/:FechaFin", ventaController.getEstadisticas);
router.get("/:_id", ventaController.getVenta);
router.delete("/:_id", ventaController.deleteVenta)


export default router;