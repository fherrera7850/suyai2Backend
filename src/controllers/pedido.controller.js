import { getConnection } from "../database/database";

const getPedidos = async (req, res) => {
    try {
        
        const connection = await getConnection();
        
        let qry = `SELECT * FROM pedido WHERE ACTIVO = TRUE;`;
        
        const result = await connection.query(qry);
        
        res.json(result);
    } catch (error) {
        
        res.status(500);
        res.send(error.message);
    }
};

const getPedido = async (req, res) => {

    try {
        const { id } = req.params;

        const connection = await getConnection();
        
        let qry = `SELECT * FROM pedido WHERE idUsuario = ${id};`
        
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

const addPedido = async (req, res) => {

    const connection = await getConnection();

    try {
        await connection.query('START TRANSACTION')
        await connection.query("INSERT INTO pedido SET ?", req.body)
        await connection.query("commit")
        
        res.sendStatus(200);
    } catch (error) {
        
        await connection.query("rollback")
        
        console.log("Rollback. ERROR:", error)
        res.sendStatus(500)
    }
}

const updatePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, estado, comentario, monto } = req.body;

        if (id === undefined || nombreProducto === undefined || descripcionProducto === undefined || precio === undefined || stock === undefined || activo === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
            return;
        }

        const pedido = { fecha, estado, comentario, monto };
        
        const connection = await getConnection();
        const result = await connection.query("UPDATE pedido SET ? WHERE idPedido = ?", [pedido, id]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM pedido WHERE idPedido = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getPedidos,
    getPedido,
    addPedido,
    updatePedido,
    deletePedido
};