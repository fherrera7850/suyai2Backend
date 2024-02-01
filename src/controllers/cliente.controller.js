//DEBO FILTRAR QUE EL CLIENTE SE PUEDA ELIMINAR SOLO A EL

import { getConnection } from "./../database/database";

const getClientes = async (req, res) => {
    try {
        const connection = await getConnection();
        let qry = "SELECT * FROM usuario JOIN rol WHERE usuario.activo = true AND rol.abreviacionRol = 'c';" //SELECT * FROM usuario WHERE ACTIVO = TRUE;
        const result = await connection.query(qry);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        let qry = `SELECT idUsuario,nombreCompleto,email,direccion,lat,lng,telefono,abreviacionRol FROM usuario JOIN rol ON usuario.idRol = rol.idRol WHERE usuario.idUsuario = ${id} AND rol.abreviacionRol = 'c' and activo = 1;` //SELECT * FROM usuario WHERE idUsuario = ${id};
        const result = await connection.query(qry);
        if (result.length === 0){
            res.sendStatus(204);
        }else{
            // Deshabilitar la caché
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
            res.json(result);
        }
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addCliente = async (req, res) => {

    const connection = await getConnection();

    try {
        await connection.query('START TRANSACTION')
        await connection.query("INSERT INTO usuario SET ?", req.body)
        await connection.query("commit")
        res.sendStatus(200);
    } catch (error) {
        await connection.query("rollback")
        console.log("Rollback. ERROR:", error)
        res.sendStatus(500)
    }
}

const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreUsuario, passwordUsuario, direccion, telefono, activo } = req.body;

        if (id === undefined || nombreUsuario === undefined || passwordUsuario === undefined || direccion === undefined || telefono === undefined || activo === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
            return;
        }

        const usuario = { nombreUsuario, passwordUsuario, direccion, telefono, activo };
        const connection = await getConnection();
        const result = await connection.query("UPDATE usuario SET ? WHERE idUsuario = ?", [usuario, id]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM usuario WHERE idUsuario = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getClientes,
    getCliente,
    addCliente,
    updateCliente,
    deleteCliente
};