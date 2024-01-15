import { getConnection } from "./../database/database";

const getProductos = async (req, res) => {
    try {
        const connection = await getConnection();
        let qry = "select p.*, count(pv.Producto_id) as Ventas "
        qry += "from producto p left join productoventa pv "
        qry += "on p._id=pv.Producto_id "
        qry += "GROUP by p._id "
        qry += "order by ventas desc"
        const result = await connection.query(qry);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

export const methods = {
    getProductos
};