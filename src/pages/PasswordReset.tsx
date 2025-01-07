import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Config from "../components/Config";
import ValidateSession from "../components/ValidateSession";
import Cargador from "../components/Cargador";
import BackgroundPage from "../components/BackgroundPage";

function PasswordReset() {
  const navigate = useNavigate();

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    correo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const token = localStorage.getItem("token");
  //? si hay sesion redirige a donde corresponda
  if (token) {
    const { error, loading, tipoUsuario } = ValidateSession({
      route: "validate_token",
      method: "POST",
    });

    if (loading) {
      return <Cargador />; // Mostrar un indicador de carga mientras valida
    }

    if (error) {
      console.log(error);
    }

    if (tipoUsuario == "cliente") navigate("/panel_cliente");
    else if (tipoUsuario == "admin") navigate("/panel_admin");
    else navigate("/");
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviar los datos al backend usando fetch
      const response = await fetch(`${Config.apiBaseUrl}/password_reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const data = await response.json();
        Swal.fire(
          data.detail ||
            "Error al enviar el correo de recuperación para tu contraseña"
        );
        Swal.fire(`${data.detail}`);
      } else {
        const data = await response.json();
        // console.log(data);

        Swal.fire(data.detail);

        navigate("/");
      }
    } catch (err) {
      //   console.error("Error:", err);
      Swal.fire(`Hubo un error al procesar la solicitud`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center isolate bg-white px-2 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Columna Izquierda */}
          <div className="md:w-1/2 bg-gradient-to-b from-pink-500 to-purple-600 flex flex-col items-center justify-center text-white p-8">
            <div className="mb-4">
              <img
                src="/logo.png" // Cambia esta URL por tu imagen
                alt="Logo"
                className="w-40 h-40"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">Recupera tu cuenta</h1>
            <p className="text-center">
              Se te enviará un correo a tu dirección en caso de que estes
              resgitrado
            </p>
          </div>

          {/* Columna Derecha */}
          <div className="md:w-1/2 flex flex-col justify-center p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Recuperar contraseña
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="form-group">
                <label htmlFor="correo">Correo Electrónico</label>
                <br />
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$"
                  title="Ingrese un correo válido. Ej: micorreo@gmail.com"
                />
              </div>

              {/* Botones */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white py-3 mt-4 rounded-lg shadow hover:bg-purple-700 transition"
              >
                {isSubmitting ? (
                  <b className="my-auto">Espere... </b>
                ) : (
                  "Recuperar mi cuenta"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default PasswordReset;
