import { getConnection } from "../database/database";

const getPedidos = async (req, res) => {
    console.log(req.user);

    try {
        const connection = await getConnection();
        const { id, fechaPedido } = req.params;

        let idRol;

        // Obtener idRol directamente desde la base de datos
        const userQuery = `SELECT idUsuario, idRol FROM usuario WHERE idUsuario = ${id};`;
        const userResult = await connection.query(userQuery);

        if (userResult.length > 0) {
            idRol = userResult[0].idRol;
        } else {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Usar idRol en la lógica de autorización
        let qry;

        if (idRol === 1) {
            // Si el usuario es administrador (idRol = 1), mostrar todos los pedidos o filtrar por fecha
            if (fechaPedido) {
                qry = `SELECT * FROM pedido WHERE fecha = '${fechaPedido}';`;
            } else {
                qry = `SELECT * FROM pedido;`;
            }
        } else if (idRol === 3) {
            // Si el usuario es cliente (idRol = 3), mostrar sus propios pedidos
            qry = `SELECT * FROM pedido WHERE idUsuario = ${id};`;
        } else {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const result = await connection.query(qry);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

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
        const fechaObjeto = new Date();
        const { estado, monto } = req.body;

        await connection.query('START TRANSACTION')
        await connection.query("INSERT INTO pedido SET ?", [{fecha: fechaObjeto, estado, monto}]);
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
        const { fecha, estado, monto } = req.body;

        if (fecha === undefined || estado === undefined || monto === undefined) {
            res.status(400).json({ message: "Bad Request. Please fill all field." });
            return;
        }

        const pedido = { fecha, estado, monto };
        
        const connection = await getConnection();
        const result = await connection.query("UPDATE pedido SET ? WHERE idPedido = ?", [id, pedido]);
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

const getDetallePedido = async (req, res) => {
    try {
        const { id } = req.params;


        const connection = await getConnection();
        
        let qry =   `SELECT 
                        c.idPedido, 
                        u.nombreCompleto, 
                        u.direccion,
                        u.telefono,
                        u.email,
                        c.cantidad, 
                        p.fecha, 
                        p.estado, 
                        p.monto 
                    FROM carrito c
                    JOIN pedido p ON c.idPedido = p.idPedido
                    JOIN usuario u ON p.idUsuario = u.idUsuario
                    WHERE u.idUsuario = ${id};`
        
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

export const methods = {
    getPedidos,
    getPedido,
    addPedido,
    updatePedido,
    deletePedido,
    getDetallePedido
};