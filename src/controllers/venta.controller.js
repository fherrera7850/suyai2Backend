import { getConnection } from "./../database/database";

const addVenta = async (req, res) => {

    const { Venta, ProductosVenta, Pedido } = req.body
    let fx = Venta.Fecha.toString()
    fx = fx.replace(/T/g, " ")
    fx = fx.replace(/Z/g, "")
    Venta.Fecha = fx
    if (Pedido)
        Pedido.FechaCreacion = fx
    console.log("🚀 ~ file: venta.controller.js ~ line 8 ~ addVenta ~ fx", fx)


    const connection = await getConnection();

    try {
        await connection.query('START TRANSACTION')
        const resVenta = await connection.query("INSERT INTO venta SET ?", Venta)
        const idVenta = resVenta.insertId
        console.log("🚀 ~ file: venta.controller.js:19 ~ addVenta ~ idVenta", idVenta)
        for (const key in ProductosVenta) {
            let PV = {
                Venta_id: idVenta,
                Producto_id: ProductosVenta[key]._id,
                Cantidad: ProductosVenta[key].Cantidad,
                PrecioVentaProducto: ProductosVenta[key].PrecioVenta > 0 ? ProductosVenta[key].PrecioVenta : ProductosVenta[key].Precio
            }
            console.log("🚀 ~ file: venta.controller.js:27 ~ addVenta ~ PV", PV)
            await connection.query("INSERT INTO productoventa SET ?", PV)
        }

        console.log("🚀 ~ file: venta.controller.js:34 ~ addVenta ~ Pedido", Pedido)

        if (Pedido) {
            Pedido.Venta_id = idVenta
            console.log("🚀 --------HACE INSERT DE PEDIDO-------")
            //quita campo GuardarCambios del json
            if (Pedido.hasOwnProperty('GuardarCambios')) {
                delete Pedido.GuardarCambios;
            }
            await connection.query("INSERT INTO pedido SET ?", Pedido)
        }

        await connection.query("COMMIT;")
        console.log("commit")
        res.sendStatus(200)
    } catch (error) {
        await connection.query("ROLLBACK;")
        console.log("🚀rollback", error)
        res.sendStatus(500)
    } finally {
        await connection.query("COMMIT;")
    }
}

const getVenta = async (req, res) => {
    try {
        const { _id } = req.params
        console.log("🚀 ~ file: venta.controller.js:92 ~ getVenta ~ req.body", req.body)
        const connection = await getConnection();

        let qry = `CALL Sel_DetalleVentaProductos(${_id});`

        const resultVenta = await connection.query(qry);

        res.json(resultVenta[0]);

    } catch (error) {
        console.error(error)
        res.status(500);
        res.send(error.toString());
    }
};

const deleteVenta = async (req, res) => {
    const { _id } = req.params
    const connection = await getConnection();

    try {
        await connection.query('START TRANSACTION;')
        await connection.query(`DELETE FROM venta WHERE _id=${_id};`)
        await connection.query("COMMIT;")
        console.log("commit")
        res.sendStatus(200)
    } catch (error) {
        await connection.query("ROLLBACK;")
        console.log("🚀rollback", error)
        res.sendStatus(500)
    }
};

const getHistorial30Dias = async (req, res) => {
    try {
        const connection = await getConnection();

        let qry = 'SELECT count(_id) as NroVentas,sum(Preciototalventa) as SumaVentas, DATE_FORMAT(DATE_SUB(fecha, INTERVAL 3 HOUR), "%Y-%m-%d") as FechaVenta '
        qry += 'from venta '
        qry += 'WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 30 day) '
        qry += 'and _id not in (select Venta_id from pedido where Estado = "I") '
        qry += 'GROUP by FechaVenta '
        qry += 'order by FechaVenta desc'
        console.log("🚀 ~ file: venta.controller.js ~ line 48 ~ getHistorial30Dias ~ qry", qry)

        const resultAgrupados = await connection.query(qry);

        if (resultAgrupados.length > 0) {
            resultAgrupados.forEach(element => element.Ventas = [])

            let qry2 = 'SELECT v._id, sum(pv.Cantidad) CantidadItems, v.PrecioTotalVenta,v.MedioPago,c.Nombre Cliente, DATE_FORMAT(DATE_SUB(v.fecha, INTERVAL 3 HOUR), "%Y-%m-%dT%H:%i:%s") as Fecha, v.observacion as Observacion,CONCAT(TRIM(c.Calle), ", ", TRIM(c.Comuna)) Direccion '
            qry2 += 'from venta v left join cliente c '
            qry2 += 'on v.Cliente_id=c._id '
            qry2 += 'left join productoventa pv '
            qry2 += 'on pv.Venta_id=v._id '
            qry2 += 'WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 day)  '
            qry2 += 'and v._id not in (select Venta_id from pedido where Estado = "I") '
            qry2 += 'GROUP by v._id '
            qry2 += 'order by v.fecha desc; '

            const resultVentas = await connection.query(qry2);

            //console.log(resultAgrupados[0], resultVentas[0])

            resultAgrupados.forEach(parent => {
                resultVentas.forEach(child => {
                    if (parent.FechaVenta === child.Fecha.split("T")[0]) {
                        parent.Ventas.push(child)
                    }
                });
            });
            res.json(resultAgrupados);
            res.status(200);
        }
        else {
            res.json({ ErrorMessage: "No hay ventas para mostrar" })
        }


    } catch (error) {
        console.error(error)
        res.status(500);
        res.send(error.toString());
    }
};


const getEstadisticas = async (req, res) => {
    try {

        const connection = await getConnection();

        let ObjEstadisticas = {
            Generales: null,
            MasVendidos: null,
            MediosDePago: null
        }

        let qryTotales = "CALL Sel_EstadisticasGenerales('" + req.params.FechaInicio + "', '" + req.params.FechaFin + "');";
        const resultTotales = await connection.query(qryTotales);
        console.log("🚀 ~  resultTotales 1era query", resultTotales)

        let qryMediosDePago = "CALL Sel_EstadisticasMediosDePago('" + req.params.FechaInicio + "', '" + req.params.FechaFin + "');"
        const resultMediosDePago = await connection.query(qryMediosDePago);
        console.log("🚀 ~  resultMediosDePago 2da consulta", resultMediosDePago)

        let qryMasVendidos = "CALL Sel_EstadisticasProductosMasVendidos('" + req.params.FechaInicio + "', '" + req.params.FechaFin + "');"
        const resultMasVendidos = await connection.query(qryMasVendidos);
        console.log("🚀 ~ resultMasVendidos 3eraq comsultas", resultMasVendidos)


        if (resultTotales.length > 0) {
            ObjEstadisticas.Generales = resultTotales[0]; //pq trae la consulta como array y es solo 1 objeto
            ObjEstadisticas.MediosDePago = resultMediosDePago[0];
            ObjEstadisticas.MasVendidos = resultMasVendidos[0];
        }

        res.json(ObjEstadisticas);


    } catch (error) {
        res.status(500);
        res.send(error.message);
        console.log("🚀 ~ file: venta.controller.js:207 ~ getEstadisticas ~ error", error)
    }
};

export const methods = {
    addVenta,
    getHistorial30Dias,
    getEstadisticas,
    getVenta,
    deleteVenta
};