const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config(); // Cargar variables de entorno desde el archivo .env

const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000; // Utiliza el puerto definido en las variables de entorno o el puerto 5000 por defecto

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.post("/api/clientes", async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body;
    const query =
      "INSERT INTO cliente (nombre, apellido, email) VALUES ($1, $2, $3) RETURNING *";
    const values = [nombre, apellido, email /* Valores correspondientes */];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al insertar cliente:", error);
    res
      .status(500)
      .json({ error: "Error al insertar cliente", details: error.message });
  }
});

// Ruta para obtener datos de la base de datos
app.get("/datos", async (req, res) => {
  try {
    const resultados = await pool.query("SELECT * FROM cliente"); // Reemplaza 'tabla' por el nombre de tu tabla
    res.json(resultados.rows);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});
// Agregar un nuevo caso a un cliente específico
app.post("/clientes/:idCliente/casos", async (req, res) => {
  const { idCliente } = req.params;
  const { descripcion, titulo } = req.body;
  const clienteId = req.body.cliente_id; // Cambiar la forma de obtener el id del cliente

  try {
    const query =
      "INSERT INTO casos (id_cliente, descripcion, titulo) VALUES ($1, $2, $3) RETURNING *";
    const values = [clienteId, descripcion, titulo];
    const newCase = await pool.query(query, values);
    res.json(newCase.rows[0]);
  } catch (error) {
    console.error("Error al agregar caso:", error);
    res.status(500).json({ error: "Error al agregar caso: " + error.message });
  }
});

// Endpoint para eliminar un cliente por ID
app.delete("/clientes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Antes de eliminar el cliente, elimina los casos asociados a este cliente
    await pool.query("DELETE FROM casos WHERE id_cliente = $1", [id]);

    // Luego, elimina al cliente
    const response = await pool.query(
      "DELETE FROM cliente WHERE id_cliente = $1",
      [id]
    );

    res.json({ message: "Cliente eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res
      .status(500)
      .json({ error: "Error al eliminar cliente: " + error.message });
  }
});

app.get("/clientes/:idCliente/casos", async (req, res) => {
  const { idCliente } = req.params;

  try {
    // Aquí realizas la consulta a tu base de datos para obtener los casos asociados al cliente
    // Puedes adaptar esta parte dependiendo de tu esquema de base de datos
    const query = "SELECT * FROM casos WHERE id_cliente = $1";
    const casosCliente = await pool.query(query, [idCliente]);

    res.json(casosCliente.rows);
  } catch (error) {
    console.error("Error al obtener casos del cliente:", error);
    res
      .status(500)
      .json({ error: "Error al obtener casos del cliente: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend en ejecución en el puerto ${PORT}`);
});
