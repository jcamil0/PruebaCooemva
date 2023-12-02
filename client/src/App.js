import React, { useState } from "react";
import DatosComponent from "./components/DatosComponent";
import ClienteForm from "./components/ClienteForm";
import CasoForm from "./components/CasoForm"; // Importa el nuevo componente

function App() {
  const [actualizar, setActualizar] = useState(false);

  const actualizarDatos = () => {
    setActualizar(!actualizar);
  };

  const [mostrarCasoForm, setMostrarCasoForm] = useState(false); // Nuevo estado para mostrar el formulario de casos

  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <button onClick={() => setMostrarCasoForm(false)}>
                Ver Clientes
              </button>
            </li>
            <li>
              <button onClick={() => setMostrarCasoForm(true)}>
                Agregar Caso
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        {mostrarCasoForm ? (
          <CasoForm actualizarCasos={actualizarDatos} />
        ) : (
          <>
            <ClienteForm actualizarDatos={actualizarDatos} />
            <DatosComponent key={actualizar} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
