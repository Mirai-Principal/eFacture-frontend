import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ValidateSession from "../components/ValidateSession";
import Cargador from "../components/Cargador";

const PanelUsuario = () => {
  const navigate = useNavigate();

  const { error, loading } = ValidateSession();

  if (loading) {
    return <Cargador />; // Mostrar un indicador de carga mientras valida
  }

  if (error) {
    return console.log(error);
  }

  const handleLogout = () => {
    // Eliminar el token
    localStorage.removeItem("token");

    // Redirigir al login
    navigate("/");
  };

  return (
    <div className="panel-usuario">
      <div>
        <h1>Panel del Usuario</h1>
        <button onClick={handleLogout}>Cerrar Sesión</button>

        <button>Extraer comprobantes</button>
        <button>Realizar deducción</button>
        <button>Ver historial de deducciones</button>
        <button>Predicción de gastos</button>

        <button>Gestionar Membresías</button>
        <button>Gestionar categorias</button>
        <button>Listar clientes registrados</button>
        <button>Sueldo básico</button>
      </div>
    </div>
  );
};

export default PanelUsuario;
