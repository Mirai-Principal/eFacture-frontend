import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Config from "./Config";

interface ValidateProps {
  route: string;
  body?: string;
  method: string;
  k?: string;
  setEstado?: React.Dispatch<React.SetStateAction<any>>;
}
/**
 * metodo para validar la session y para realizar peticiones
 * @param route
 * @param body para enviar datos
 * @param method
 * @param k token de sesion
 * @param setEstado para devolver datos dentro de un estado
 * @returns error, loading, res, tipoUsuario
 */
const ValidateSession = (props: ValidateProps) => {
  const { route, body, method, k, setEstado } = props;
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); //estado de la carga
  const [res, setRes] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);

  useEffect(() => {
    const token = k || localStorage.getItem("token");

    if (!token) {
      setError("No estás autenticado.");
      navigate("/"); // Redirige si no hay token
      setLoading(false); //?Detiene la carga
      return;
    }

    const validar = async () => {
      try {
        const response = await fetch(`${Config.apiBaseUrl}/${route}`, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: body,
          // credentials: "include", // Permite que las cookies y otros credenciales sean enviadas/recibidas
        });

        if (!response.ok) {
          const errorData = await response.json();
          // console.warn("Error al validar el token:", errorData);
          console.log(errorData);

          Swal.fire(
            errorData || "Sesión expirada. Por favor, inicia sesión nuevamente."
          );
          if (!errorData) {
            localStorage.removeItem("token");
            navigate("/");
          }
          return;
        }

        const data = await response.json();

        const tipo_usuario = response.headers.get("tipo_usuario");
        setTipoUsuario(tipo_usuario);

        setRes(data);

        // asigna el resultado al estado de donde lo invoco
        if (!data.message) setEstado(data);

        // Guardar token para futuras solicitudes
        const new_token = response.headers.get("Authorization");
        localStorage.removeItem("token");
        localStorage.setItem("token", new_token!);

        // console.log("Validación exitosa:", data);
      } catch (err) {
        console.error("Error de red o servidor:", err);
        localStorage.removeItem("token");
        Swal.fire("Sesión expirada. Por favor, inicia sesión nuevamente.");

        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    validar();
  }, [navigate]);

  return { error, loading, res, tipoUsuario };
};

export default ValidateSession;
