import { getConnection } from "../database/database";

const CompletaPedidoVenta = async (req, res) => {

    const { id_venta, id_pedido } = req.body
    const connection = await getConnection();

    try {
        await connection.query('START TRANSACTION')
        const resVenta = await connection.query(`call UpdatePedidoVenta(${id_venta},${id_pedido});`)
        console.log("🚀 ~ file: pedidoVenta.controller.js:12 ~ addVenta ~ resVenta", resVenta)

        if (resVenta.affectedRows > 0) {
            await connection.query("commit")
            console.log("commit")
            res.sendStatus(200)
        }
        else
        {
            throw Error("No ha sido posible registrar la venta.")
        }

    } catch (error) {
        await connection.query("rollback")
        console.log("🚀rollback", error)
        res.sendStatus(500)
    }
}

export const methods = {
    CompletaPedidoVenta
};