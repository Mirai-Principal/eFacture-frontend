import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Config from "./Config";

const ValidateSession = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); //estado de la carga

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No estás autenticado.");
      navigate("/"); // Redirige si no hay token
      setLoading(false); //?Detiene la carga
      return;
    }

    const validar = async () => {
      try {
        const response = await fetch(`${Config.apiBaseUrl}/validate_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.warn("Error al validar el token:", errorData);
          Swal.fire("Sesión expirada. Por favor, inicia sesión nuevamente.");
          navigate("/");
          return;
        }

        const data = await response.json();
        console.log("Validación exitosa:", data);
      } catch (err) {
        console.error("Error de red o servidor:", err);
        setError("Error de red o servidor.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    validar();
  }, [navigate]);

  return { error, loading };
};

export default ValidateSession;
