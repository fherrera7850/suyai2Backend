import { Router } from "express";
import { methods as RegistroController } from "./../controllers/registro.controller";//as registrarUsuario

//const { registrarUsuario } = methods;
const router = Router();

router.post("/registrarUsuario", RegistroController.registrarUsuario);

export default router;
