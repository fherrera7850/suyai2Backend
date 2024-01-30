import { getConnection } from ".././database/database";

const validaPedido = async (id) => {
    try {
        const connection = await getConnection();
        let qry = `SELECT idPedido FROM pedido WHERE idUsuario = ${id} AND estado = "I"`
        const result = await connection.query(qry);
        return result.length > 0 ? result[0] : -1; //Si existe pedido abierto para el usuario retorna el idPedido, sino -1
    } catch (error) {
        return -1;
    }
};

const crearPedido = async (idUsuario) => {

    const connection = await getConnection();

    try {
        const pedido = {
            idUsuario,
            fecha: null,
            estado: 'I',
            monto: 0
        };

        await connection.query('START TRANSACTION');
        // Insertar el pedido y obtener el idPedido insertado
        const insertResult = await connection.query("INSERT INTO pedido SET ?", pedido);
        await connection.query("COMMIT");

        return insertResult.insertId;

    } catch (error) {
        await connection.query("ROLLBACK");
        console.log("Rollback. ERROR:", error);
        return -1;
    }
};

const hayProductoEnCarro = async (idPedido, idProducto) => {
    try {
        const connection = await getConnection();
        let qry = `SELECT c.idProducto FROM carrito c inner join pedido p ON c.idPedido = p.idPedido WHERE c.idProducto = ${idProducto} AND p.idPedido = ${idPedido} AND p.estado = 'I';`
        const result = await connection.query(qry);
        return result.length > 0 ? true : false; //Si existe el producto en el carro true else false
    } catch (error) {
        console.log("🚀 ~ hayProductoEnCarro ~ error:", error)
        return false;
    }
};


const actualizaCarrito = async (req, res) => {
    const { idUsuario, idProducto, cantidad } = req.body;
    console.log("🚀 ~ actualizaCarrito ~ cantidad:", cantidad)
    console.log("🚀 ~ actualizaCarrito ~ idProducto:", idProducto)
    console.log("🚀 ~ actualizaCarrito ~ idUsuario:", idUsuario)

    const connection = await getConnection();

    try {
        const existePedido = await validaPedido(idUsuario);
        let idPedido = null;
        
        if (existePedido === -1) { //No existe pedido abierto para el usuario
            idPedido = await crearPedido(idUsuario); //Crea el pedido y obtiene el idPedido
        }
        else {
            idPedido = existePedido.idPedido;
        }

        console.log("🚀 ~ actualizaCarrito ~ idPedido:", idPedido)

        const carrito = {
            idPedido,
            idProducto,
            cantidad
        }

        await connection.query('START TRANSACTION');
        if (!await hayProductoEnCarro(idPedido, idProducto)) {
            await connection.query("INSERT INTO carrito SET ?", carrito)
        }
        else {
            await connection.query(`UPDATE carrito SET cantidad = ${cantidad} WHERE idPedido = ${idPedido} AND idProducto = ${idProducto};`);
        }
        await connection.query("commit");

        let qry = `SELECT c.idProducto, c.cantidad FROM carrito c inner join pedido p ON c.idPedido = p.idPedido WHERE p.idPedido = ${idPedido};`
        const resultCarrito = await connection.query(qry);

        res.json(resultCarrito)
        res.status(200);
    } catch (error) {
        await connection.query("rollback")
        console.log("Rollback. ERROR:", error)
        res.sendStatus(500)
    }
};

export const methods = {
    actualizaCarrito
}