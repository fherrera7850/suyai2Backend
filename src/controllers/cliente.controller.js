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
        let qry = `SELECT idUsuario, nombreUsuario,nombreCompleto,email,direccion,lat,lng,telefono,abreviacionRol,puntosCliente FROM usuario JOIN rol ON usuario.idRol = rol.idRol WHERE usuario.idUsuario = ${id} 
         and activo = 1;` //SELECT * FROM usuario WHERE idUsuario = ${id};
        const result = await connection.query(qry);
        if (result.length === 0) {
            res.sendStatus(204);
        } else {
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
    
    const connection = await getConnection();
    try {
        const { id } = req.params;
        console.log("🚀 ~ updateCliente ~ id:", id)
        const { nombreUsuario, passwordUsuario, direccion, telefono, email, nombreCompleto } = req.body;
        console.log("🚀 ~ updateCliente ~ req.body:", req.body)

        if (id === undefined || nombreUsuario === undefined || email === undefined || passwordUsuario === undefined || direccion === undefined || telefono === undefined || nombreCompleto === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
            return;
        }

        await connection.query('START TRANSACTION')

        let qry = "UPDATE usuario "
        qry += "SET nombreUsuario = '" + nombreUsuario + "', "
        if (passwordUsuario !== "******") //actualiza la password solo si viene modificada (password ****** es por defecto)
            qry += "passwordUsuario = '" + passwordUsuario + "', "
        qry += "direccion = '" + direccion + "', "
        qry += "telefono = '" + telefono + "', "
        qry += "nombreCompleto = '" + nombreCompleto + "', "
        qry += "email = '" + email + "' "
        qry += "WHERE idUsuario = " + id + ";";
        await connection.query(qry);
        
        await connection.query("commit")
        res.sendStatus(200);
    } catch (error) {
        await connection.query("rollback")
        console.log("Rollback. ERROR:", error)
        res.sendStatus(500)
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