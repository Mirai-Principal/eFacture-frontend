import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Swal from "sweetalert2";
import { Dialog } from "../components/Alerts";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Config from "../components/Config";
import BackgroundPage from "../components/BackgroundPage";
import ValidateSession from "../components/ValidateSession";
import Cargador from "../components/Cargador";

function CambiarPassword() {
  const navigate = useNavigate();

  const sesion = localStorage.getItem("token");

  let TipoUsuario: string | null = "";

  // Obtener los parámetros de la URL
  const [searchParams] = useSearchParams();
  // Obtener valores de los query parameters
  let token = searchParams.get("k");
  if (token) token = `Bearer ${token}`;
  else token = sesion;

  useEffect(() => {
    // if (sesion) {
    //   navigate("/"); // Redirige si hay token de sesion
    // }

    if (!token) {
      navigate("/login"); // Redirige al login si no hay token
      return;
    }
    const validate_token = async () => {
      try {
        const response = await fetch(`${Config.apiBaseUrl}/validate_token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          Swal.fire(`Link expirado`);
          navigate("/");
          throw new Error(errorData.detail || "Something went wrong");
        }

        const data = await response.json();

        // console.log("Datos recibidos:", data);
      } catch (error) {
        Swal.fire(`Link expirado`);
        console.log(error.message);

        navigate("/");
      }
    };

    if (sesion == "") validate_token();
  }, [navigate]);

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null); // Para manejar errores

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  //? Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviar los datos al backend usando fetch
      const response = await fetch(`${Config.apiBaseUrl}/cambiar_password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        setError(data.detail || "Error al registrar el usuario");
        Swal.fire(`${data.detail}`);
      } else {
        Dialog(data.detail || "Se cambiado tu contraseña");
        // console.log(data);

        if (sesion) navigate("/perfil");
        else navigate("/login");
      }
    } catch (err) {
      //   console.error("Error:", err);
      setError("Hubo un error al procesar la solicitud");
      Swal.fire(`${"Hubo un error al procesar la solicitud"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sesion) {
    //valida la sesion
    const { error, loading, tipoUsuario, res } = ValidateSession({
      route: "validate_token",
      method: "POST",
    });
    if (loading) {
      return <Cargador />; // Mostrar un indicador de carga mientras valida
    }
    if (error) {
      console.log(error);
    }
    TipoUsuario = tipoUsuario;
  }

  return (
    <>
      <Navbar
        es_admin={TipoUsuario === "admin"}
        es_cliente={TipoUsuario === "cliente"}
      />
      <div className="flex items-center justify-center isolate bg-white px-2 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className=" p-6 max-w-4xl w-full">
          <h1 className="text-2xl font-bold text-gray-700 text-center mb-6">
            Cambiar Contraseña
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 bg-white shadow-lg rounded-lg lg:p-6 md:p-6 p-2 w-80 mx-auto">
            <form onSubmit={handleSubmit} method="POST" className="">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Debe contener al menos un número y una letra mayúscula y minúscula, y al menos 8 o más caracteres"
                />
              </div>
              <div>
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  required
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Debe contener al menos un número y una letra mayúscula y minúscula, y al menos 8 o más caracteres"
                />
              </div>
              {formData.password === formData.confirm_password ? (
                ""
              ) : (
                <small className="text-red-600">
                  La contraseña no es igual
                </small>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                Cambiar Contraseña
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CambiarPassword;
