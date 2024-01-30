import { getConnection } from "./../database/database";
//import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { getDefaultCart } from './../cartUtils';


const encryptData = (data) => {
  // Usar una clave secreta para cifrar los datos (guardar esta clave de forma segura)

  const secretKey = crypto.randomBytes(32); // Genera una clave de 32 bytes para aes-256-cbc
  const iv = crypto.randomBytes(16); // Genera un vector de inicialización de 16 bytes

  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');

  return encryptedData;
};

  const loginUsuario = async (req, res) => {
  const connection = await getConnection();

  const { nombreUsuario, passwordUsuario } = req.body;
  console.log("🚀 ~ loginUsuario ~ passwordUsuario:", passwordUsuario);
  console.log("🚀 ~ loginUsuario ~ nombreUsuario:", nombreUsuario);

  try {
    const result = await connection.query(
      `SELECT u.idUsuario, r.idRol FROM usuario u INNER JOIN rol r ON r.idRol = u.idRol WHERE u.nombreUsuario = '${nombreUsuario}' AND u.passwordUsuario = '${passwordUsuario}';`,
      req.body
    );

    if (result.length > 0) {
      const idUsuario = result[0].idUsuario;
      //const idRol = result[0].idRol;

      // Encriptar la información de la sesión
      const encryptedIdUsuario = encryptData(idUsuario.toString());
      //const encryptedIdRol = encryptData(idRol.toString());

      // Establecer la información de la sesión y el carrito en la cookie
      res.cookie('sesionUsuario', JSON.stringify({ idUsuario: encryptedIdUsuario, idRol: encryptedIdRol, cartItems: getDefaultCart() }), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.status(200).send();  //json({ nombreUsuario });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    await connection.query("rollback");
    console.log("Rollback. ERROR:", error);
    res.sendStatus(500);
  }
};

export const methods = {
  loginUsuario,
};

/*-------------------------------------------------------------------------------------------------------------------------------- */
/*
//Importa la conexión hacia la base de datos
import { getConnection } from "./../database/database";

const loginUsuario = async (req, res) => {
  const connection = await getConnection();

  const { nombreUsuario, passwordUsuario } = req.body;
  console.log("🚀 ~ loginUsuario ~ passwordUsuario:", passwordUsuario);
  console.log("🚀 ~ loginUsuario ~ nombreUsuario:", nombreUsuario);

  try {
    const result = await connection.query(
      `SELECT r.abreviacionRol FROM usuario u inner join rol r on r.idRol=u.idRol WHERE u.nombreUsuario = '${nombreUsuario}' and u.passwordUsuario='${passwordUsuario}';`,
      req.body
    );

    if (result.length > 0) {
      res.json(result);

      //el codigo 200 es una respuesta HTTP al cliente que significa que la solicitud fue exitosa
      
      res.status(200).send();
    } else {
      //res.json("LOGIN INCORRECTO")
      res.status(500).send();
      //res.json("fail");
       
    }
  } catch (error) {
    //rollback es la reversion de la query, es decir revierte o invalida la inserción de datos en caso de error
    await connection.query("rollback");
    //imprime el error indicando rollback
    console.log("Rollback. ERROR:", error);
    res.sendStatus(500);
  }
};

//Exporta los metodos para que puedan ser utilizados o importados desde otras clases
export const methods = {
  loginUsuario,
};
*/