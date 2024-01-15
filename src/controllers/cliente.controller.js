import { getConnection } from "./../database/database";

const addCliente = async (req, res) => {

    const { Cliente } = req.body
    console.log("🚀 ~ file: cliente.controller.js ~ line 6 ~ addCliente ~ Cliente", Cliente)


    const connection = await getConnection();

    try {
        await connection.query('START TRANSACTION')
        const response = await connection.query("INSERT INTO cliente SET ?", req.body)
        await connection.query("commit")
        console.log("commit")
        res.sendStatus(200);
    } catch (error) {
        await connection.query("rollback")
        console.log("🚀rollback", error)
        res.sendStatus(500)
    }
}

const getClientes = async (req, res) => {
    try {
        const connection = await getConnection();
        let qry = "select _id,nombre,telefono,direccion,calle,comuna,email,observacion from cliente order by nombre"
        const result = await connection.query(qry);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getCliente = async (req, res) => {
    try {
        const { _id } = req.params
        const connection = await getConnection();
        let qry = `select _id,nombre,telefono,direccion,calle,comuna,email,observacion from cliente where _id=${_id}`
        const result = await connection.query(qry);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    addCliente,
    getClientes,
    getCliente
};