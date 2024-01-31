//Importa la conexión hacia la base de datos
import { getConnection } from "./../database/database";

//Obtiene los productos y la funcion asyn es una función asíncrona que facilita la conexion a la BBDD. Las
//promesas son parte de la funcion 'async' y son hechas en Javascript. En el contexto de Express.js y Node.js 
//las funciones asincronas son comunmente utilizadas para rutas o controladores de solicitudes HTTP para poder
//realizar funciones como consultas a BBDD o consumo de API's externas
const getProductos = async (req, res) => {
    try {
        const { id } = req.params;
        //await es parte de la implementación de async
        //obtiene la conexion
        const connection = await getConnection();
        //query
        let qry = "";
        if (id === 0) {
            qry += "select idProducto, null as idUsuario, 0 as cantidad,nombreProducto, descripcionProducto, precio, stock, imagen ";
            qry += "from producto ";
            qry += "where activo = 1 order by 1;"
        } else {
            qry += `SELECT idProducto, idUsuario, cantidad, nombreProducto, descripcionProducto, precio, stock, imagen `;
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
            qry += `WHERE ped.idusuario = ${id} AND ped.estado = 'I' AND prod.activo = 1 `;
            qry += `) AS combined `;
            qry += `) AS numbered `;
            qry += `WHERE rn = 1 `;
            qry += `order by 1;`;
        }
        /* let qry = "select idProducto, null as idUsuario, 0 as cantidad,nombreProducto, descripcionProducto, precio, stock, imagen ";
        qry += "from producto ";
        qry += "where activo = 1;" */
        //crea la variable result y le asigna el resultado de la query mediante connection.query(qry);
        const result = await connection.query(qry);
        //res es el objeto de respuesta de Express y pasa el resultado de la query a formato JSON,
        //entonces cuando el cliente haga una solicitud GET el servidor responderé en formato JSON
        res.json(result);
    } catch (error) {
        //retorna el error 500 (error interno del servidor)
        res.status(500);
        res.send(error.message);
    }
};

const getProducto = async (req, res) => {
    console.log("🚀 ~ getProducto ~ req:", req)
    try {
        const { id } = req.params;
        const connection = await getConnection();
        let qry = `SELECT * FROM producto WHERE idProducto = ${id};`
        const result = await connection.query(qry);
        res.json(result);
        if (result.length === 0) {
            //retorna error 204 (no hay objetos que retornar)
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
        //el error 200 es una respuesta HTTP al cliente que significa que la solicitud fue exitosa
        res.sendStatus(200);
    } catch (error) {
        //rollback es la reversion de la query, es decir revierte o invalida la inserción de datos en caso de error
        await connection.query("rollback")
        //imprime el error indicando rollback
        console.log("Rollback. ERROR:", error)
        res.sendStatus(500)
    }
}

const updateProducto = async (req, res) => {
    try {
        //define la constante id como el req (id) que pasa el admin para actualizar el producto
        const { id } = req.params;
        //Desestructura los datos ingresados por el usuario en el objeto de la solicitud (req),
        //es como si los envolviera en un solo objeto en vez de pasarle los datos uno por uno a las constantes
        const { nombreProducto, descripcionProducto, precio, stock, activo } = req.body;

        //funcion de control de campos indefinidos
        if (id === undefined || nombreProducto === undefined || descripcionProducto === undefined || precio === undefined || stock === undefined || activo === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
            return;
        }

        //inserta los datos en el producto
        const producto = { nombreProducto, descripcionProducto, precio, stock, activo };
        //obtiene la conexion para realizar el update en la BBDD
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

//Exporta los metodos para que puedan ser utilizados o importados desde otras clases
export const methods = {
    getProductos,
    getProducto,
    addProducto,
    updateProducto,
    deleteProducto
};