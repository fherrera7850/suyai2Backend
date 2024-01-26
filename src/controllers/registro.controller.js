import {getConnection} from ".././database/database";
//import bcrypt from 'bcrypt';

const registrarUsuario = async (req, res) => {
    const {idRol, nombreUsuario, passwordUsuario, email, direccion, telefono, activo, nombreCompleto} = req.body;

    if (!nombreUsuario || !passwordUsuario || !email || !direccion || !telefono || !nombreCompleto) {
        res.status(400).json({ message: "Bad Request. Please fill all required fields." });
        return;
    }

    const connection = await getConnection();

    try {
        await connection.query('START TRANSACTION')

        //const hashedPassword = await bcrypt.hash(passwordUsuario, 10);

        const usuarioNuevo = { 
            idRol,
            nombreUsuario, 
            passwordUsuario, //: hashedPassword, 
            email, 
            direccion, 
            telefono, 
            activo: 1,
            nombreCompleto,
        };

        await connection.query("INSERT INTO usuario SET ?", usuarioNuevo);//req.body //('INSERT INTO usuarios (nombreUsuario, passwordUsuario, email, direccion, telefono, activo) VALUES (?, ?, ?, ?, ?, ?)', [nombreUsuario, hashedPassword, email, direccion, telefono, 1])
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

};

export const methods = {
    registrarUsuario
}