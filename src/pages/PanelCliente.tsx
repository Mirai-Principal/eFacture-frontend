import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PanelUsuario = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPanelData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No estás autenticado.");
        navigate("/login"); // Redirige al login si no hay token
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/validate_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Swal.fire(`Error al obtener datos\n ${errorData.detail}`);
          Swal.fire(`Sesión expirada`);
          navigate("/login");
        } else {
          const data = await response.json();
          console.log("Datos recibidos:", data);
        }
      } catch (err) {
        setError("Error de red o servidor.");
        navigate("/login");
      }
    };

    fetchPanelData();
  }, [navigate]);

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
        <p>{message}</p>
        <button
          onClick={handleLogout}
          style={{ padding: "10px", backgroundColor: "red", color: "white" }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default PanelUsuario;
