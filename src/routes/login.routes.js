import { Router } from "express";
import { methods as LoginController } from "./../controllers/login.controller";

//const { registrarUsuario } = methods;
const router = Router();

router.post("/loginUsuario", LoginController.loginUsuario);

export default router;