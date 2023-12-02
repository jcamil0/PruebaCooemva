import React, { useState, useEffect } from "react";
import axios from "axios";

function DatosComponent() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/datos");
      const datosConCasos = await Promise.all(
        response.data.map(async (dato) => {
          const casosCliente = await obtenerCasosCliente(dato.id_cliente);
          return { ...dato, casos: casosCliente };
        })
      );
      setDatos(datosConCasos);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const obtenerCasosCliente = async (idCliente) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/clientes/${idCliente}/casos`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener casos del cliente:", error);
      return [];
    }
  };

  const eliminarCliente = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/clientes/${id}`
      );
      console.log("Cliente eliminado:", response.data);
      obtenerDatos();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
    }
  };

  return (
    <div className="datos-component">
      {datos.map((dato) => (
        <div key={dato.id_cliente}>
          <h2>Información de los clientes {dato.id_cliente}</h2>
          <div className="column-titles">
            <div className="title">Nombre:</div>
            <div className="title">Apellido:</div>
            <div className="title">Email:</div>
          </div>
          <div className="client-data">
            <div>{dato.nombre}</div>
            <div>{dato.apellido}</div>
            <div>{dato.email}</div>
          </div>

          <h2>Casos Relacionados</h2>
          <ul className="cases-list">
            {dato.casos &&
              dato.casos.map((caso) => (
                <li key={caso.id_caso}>
                  <strong>Título:</strong> {caso.titulo} {"     "}
                  <strong>Descripción:</strong> {caso.descripcion}
                </li>
              ))}
          </ul>

          <button
            className="button-delete"
            onClick={() => eliminarCliente(dato.id_cliente)}
          >
            Eliminar Cliente
          </button>
        </div>
      ))}
    </div>
  );
}

export default DatosComponent;
