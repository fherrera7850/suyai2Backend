import { getConnection } from "./../database/database";

const getProductos = async (req, res) => {
    try {
        const connection = await getConnection();
        let qry = "SELECT * FROM producto WHERE ACTIVO = TRUE;"
        const result = await connection.query(qry);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        let qry = `SELECT * FROM producto WHERE idProducto = ${id};`
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

const addProducto = async (req, res) => {

    const connection = await getConnection();

    try {
        await connection.query('START TRANSACTION')
        await connection.query("INSERT INTO producto SET ?", req.body)
        await connection.query("commit")
        res.sendStatus(200);
    } catch (error) {
        await connection.query("rollback")
        console.log("Rollback. ERROR:", error)
        res.sendStatus(500)
    }
}

const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreProducto, descripcionProducto, precio, stock, activo } = req.body;

        if (id === undefined || nombreProducto === undefined || descripcionProducto === undefined || precio === undefined || stock === undefined || activo === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
            return;
        }

        const producto = { nombreProducto, descripcionProducto, precio, stock, activo };
        const connection = await getConnection();
        const result = await connection.query("UPDATE producto SET ? WHERE idProducto = ?", [producto, id]);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM producto WHERE idProducto = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getProductos,
    getProducto,
    addProducto,
    updateProducto,
    deleteProducto
};