import { getConnection } from "./../database/database";

const getClientes = async (req, res) => {
    try {
        const connection = await getConnection();
        let qry = "SELECT * FROM usuario WHERE ACTIVO = TRUE;"
        const result = await connection.query(qry);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        let qry = `SELECT usuario.*, rol.abreviacionRol FROM usuario JOIN rol ON usuario.idRol = rol.idRol WHERE usuario.activo = true AND rol.abreviacionRol = 'a';`
        const result = await connection.query(qry);
        res.json(result);
        if (result.length === 0){
            res.status(204);
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
    getAdmin,
    addCliente,
    updateCliente,
    deleteCliente
};