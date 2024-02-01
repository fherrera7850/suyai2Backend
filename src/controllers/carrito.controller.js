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

const carroProductos = async (idUsuario) => {
    try {
        const connection = await getConnection();
        await connection.query('START TRANSACTION');
        let qry = `SELECT idProducto, idUsuario, cantidad, nombreProducto, descripcionProducto, precio, stock, imagen `;
        qry += `FROM (`;
        qry += `SELECT idProducto, idUsuario, cantidad, nombreProducto, descripcionProducto, precio, stock, imagen, ROW_NUMBER() OVER (PARTITION BY idProducto ORDER BY idUsuario DESC) AS rn `;
        qry += `FROM (`;
        qry += `SELECT idProducto, NULL AS idUsuario, 0 AS cantidad, nombreProducto, descripcionProducto, precio, stock, imagen `;
        qry += `FROM producto `;
        qry += `WHERE activo = 1 `;
        qry += `UNION `;
        qry += `SELECT prod.idProducto, ped.idUsuario, c.cantidad, prod.nombreProducto, prod.descripcionProducto, prod.precio, prod.stock, prod.imagen `;
        qry += `FROM pedido ped INNER JOIN carrito c ON ped.idPedido=c.idPedido `;
        qry += `INNER JOIN producto prod ON prod.idProducto=c.idProducto `;
        qry += `WHERE ped.idusuario = ${idUsuario} AND ped.estado = 'I' AND prod.activo = 1 `;
        qry += `) AS combined `;
        qry += `) AS numbered `;
        qry += `WHERE rn = 1 `;
        qry += `order by 1;`;
        const result = await connection.query(qry);
        await connection.query("COMMIT");

        return result;

    } catch (error) {
        console.log("🚀 ~ hayProductoEnCarro ~ error:", error)
        return [];
    }
};


const actualizaCarrito = async (req, res) => {
    const { idUsuario, idProducto, action } = req.body;
    console.log("🚀 ~ actualizaCarrito ~ action:", action)
    console.log("🚀 ~ actualizaCarrito ~ idProducto:", idProducto)
    console.log("🚀 ~ actualizaCarrito ~ idUsuario:", idUsuario)

    const connection = await getConnection();

    try {
        const existePedido = await validaPedido(idUsuario);
        let idPedido = null;

        if (existePedido === -1) { // No existe pedido abierto para el usuario
            idPedido = await crearPedido(idUsuario); // Crea el pedido y obtiene el idPedido
        } else {
            idPedido = existePedido.idPedido;
        }

        console.log("🚀 ~ actualizaCarrito ~ idPedido:", idPedido)

        await connection.query('START TRANSACTION');

        if (action === 'add') {
            if (!await hayProductoEnCarro(idPedido, idProducto)) {
                await connection.query("INSERT INTO carrito SET ?", { idPedido, idProducto, cantidad: 1 });
            } else {
                await connection.query(`UPDATE carrito SET cantidad = cantidad + 1 WHERE idPedido = ${idPedido} AND idProducto = ${idProducto};`);
            }
        } else if (action === 'remove') {
            if (await hayProductoEnCarro(idPedido, idProducto)) {
                await connection.query(`UPDATE carrito SET cantidad = cantidad - 1 WHERE idPedido = ${idPedido} AND idProducto = ${idProducto} AND cantidad > 0;`);
            }
        } else {
            throw new Error("Acción no válida");
        }

        await connection.query("COMMIT");

        res.json(await carroProductos(idUsuario)); // Obtiene los productos y cantidades actualizadas y los retorna en el json
        res.status(200);
    } catch (error) {
        await connection.query("ROLLBACK");
        console.log("Rollback. ERROR:", error)
        res.sendStatus(500);
    }
};




export const methods = {
    actualizaCarrito
}