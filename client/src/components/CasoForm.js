import React, { useState, useEffect } from "react";
import axios from "axios";

function CasoForm({ idCliente, actualizarCasos }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  const [clientes, setClientes] = useState([]); // Estado para almacenar la lista de clientes
  const [clienteSeleccionado, setClienteSeleccionado] = useState(""); // Estado para almacenar el cliente seleccionado

  useEffect(() => {
    obtenerClientes(); // Llama a la función para obtener la lista de clientes al cargar el componente
  }, []);

  const obtenerClientes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/datos");
      setClientes(response.data); // Almacena la lista de clientes en el estado correspondiente
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // console.log("Título:", titulo);
    // console.log("Descripción:", descripcion);
    // console.log("Fecha de Creación:", fechaCreacion);
    // console.log("ID del Cliente:", clienteSeleccionado);

    try {
      const response = await axios.post(
        `http://localhost:5000/clientes/${clienteSeleccionado}/casos`,
        {
          titulo,
          descripcion,
          fecha_creacion: fechaCreacion,
          cliente_id: clienteSeleccionado,
        }
      );
      console.log("Caso agregado:", response.data);
      actualizarCasos();
      setTitulo("");
      setDescripcion("");
      setFechaCreacion("");
      setClienteSeleccionado("");
    } catch (error) {
      console.error("Error al agregar caso:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="caso-form">
      <select
        value={clienteSeleccionado}
        onChange={(e) => {
          console.log("Valor seleccionado:", e.target.value);
          setClienteSeleccionado(e.target.value);
        }}
      >
        <option value="">Seleccionar Cliente</option>
        {clientes.map((cliente) => (
          <option key={cliente.id_cliente} value={cliente.id_cliente}>
            {cliente.nombre}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título"
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
      ></textarea>
      <button type="submit">Agregar Caso</button>
    </form>
  );
}

export default CasoForm;
