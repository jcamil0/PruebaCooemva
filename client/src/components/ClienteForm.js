import React, { useState } from "react";
import axios from "axios";

function ClienteForm({ actualizarDatos }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/clientes", {
        nombre,
        apellido,
        email,
      });
      console.log("Cliente insertado:", response.data);
      actualizarDatos();
      setNombre("");
      setApellido("");
      setEmail("");
    } catch (error) {
      console.error("Error al insertar cliente:", error);
    }
  };

  return (
    <div className="cliente-form">
      <h2>Agregar Cliente</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
        />
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          placeholder="Apellido"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit">Guardar Cliente</button>
      </form>
    </div>
  );
}

export default ClienteForm;
