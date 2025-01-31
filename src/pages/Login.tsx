import React, { useState } from "react";
import { UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";

import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Config from "../components/Config";
import Cargador from "../components/Cargador";
import ValidateSession from "../components/ValidateSession";
import BackgroundPage from "../components/BackgroundPage";

const Login = () => {
  const navigate = useNavigate();

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
  });

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

  // Crear un controlador de aborto
  const controller = new AbortController();
  // const signal = controller.signal;
  // Crear un temporizador para abortar la solicitud después de `timeout` ms
  // const timeoutId = setTimeout(() => {
  //   controller.abort(); // Cancela el fetch
  // }, 10000);
  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(formData);

    try {
      const response = await fetch(`${Config.apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        // signal: signal,

        // credentials: "include", // Permite que las cookies y otros credenciales sean enviadas/recibidas
      });

      const data = await response.json();

      if (response.ok) {
        const token = response.headers.get("Authorization");
        const sub = response.headers.get("sub");

        localStorage.setItem("token", token); // Guardar token para futuras solicitudes
        // console.log(data);
        // clearTimeout(timeoutId); // Limpiar el temporizador si la solicitud es exitosa

        // Swal.fire(`Autenticación exitosa`);
        if (data.tipo_usuario == "admin") navigate("/panel_admin");
        else navigate("/panel_cliente");
      } else {
        Swal.fire(`${data.detail}`);
      }
    } catch (err) {
      console.log(err);

      Swal.fire(`Error de red`);
    }
  };

  const handleRegister = () => {
    navigate("/registrar");
  };

  return (
    <>
      <Navbar />

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
            <h1 className="text-3xl font-bold mb-2">Ingresa a tu cuenta</h1>
          </div>

          {/* Columna Derecha */}
          <div className="md:w-1/2 flex flex-col justify-center p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Iniciar sesión
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Username */}
              <div>
                <label htmlFor="correo" className="block text-gray-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <UserIcon className="absolute w-5 h-5 text-gray-500 left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    placeholder="Ingresa tu correo"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$"
                    title="Ingrese un correo válido. Ej: micorreo@gmail.com"
                    style={{ paddingLeft: "40px" }}
                    className="w-full py-3 px-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute w-5 h-5 text-gray-500 left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    style={{ paddingLeft: "40px" }}
                    className="w-full py-3 px-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Opciones adicionales */}
              <div className="flex justify-between items-center text-sm">
                <a
                  href="/password_reset"
                  className="text-purple-500 hover:underline"
                >
                  Olvidó su password?
                </a>
              </div>

              {/* Botones */}
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg shadow hover:bg-purple-700 transition">
                Login
              </button>
            </form>
            <button
              onClick={handleRegister}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg shadow hover:bg-gray-200 transition"
            >
              Registrar
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
