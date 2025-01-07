import React, { FocusEvent, MouseEvent, useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import ValidarCI from "../scripts/ValidarCI";
import Navbar from "../components/Navbar";
import Cargador from "../components/Cargador";
import ValidateSession from "../components/ValidateSession";
import BackgroundPage from "../components/BackgroundPage";

const Registrar = () => {
  const navigate = useNavigate();

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    identificacion: "",
    nombres: "",
    apellidos: "",
    correo: "",
    password: "",
    tipo_usuario: "cliente",
  });

  const [error, setError] = useState<string | null>(null); // Para manejar errores

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [dniValido, setDniValido] = useState(true);
  const handleBlur = (e: FocusEvent) => {
    const dni = e.target.value;
    if (dni == "") setDniValido(true);
    else setDniValido(ValidarCI(dni));
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
    if (!dniValido) {
      Swal.fire("Cédula no válida");
    } else
      try {
        // Enviar los datos al backend usando fetch
        const response = await fetch("http://localhost:8000/registrar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          const data = await response.json();
          setError(data.detail || "Error al registrar el usuario");
          console.log(data);

          Swal.fire(`${data.detail}`);
        } else {
          const data = await response.json();
          Swal.fire(`Usuario registrado con éxito`);
          // console.log("Usuario registrado con éxito", data);
          // Aquí puedes redirigir a una página de éxito o login
          navigate("/login");
        }
      } catch (err) {
        console.error("Error:", err);
        Swal.fire(`${err}`);

        setError("Hubo un error al procesar la solicitud");
      }
  };

  const handleLogin = () => {
    navigate("/login");
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
            <h1 className="text-3xl font-bold mb-2">Crea tu cuenta</h1>
            <p className="text-center">Accede a todos nuestros servicios</p>
          </div>

          {/* Columna Derecha */}
          <div className="md:w-1/2 flex flex-col justify-center p-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Iniciar sesión
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="identificacion">Identificación</label>
                <br />
                <input
                  type="text"
                  id="identificacion"
                  name="identificacion"
                  value={formData.identificacion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Cedula / RUC"
                  pattern="[0-9]{10,13}"
                  title="Solo números del 0 al 9. Ej: 0202432143001"
                  className={`w-full py-3 px-10 border  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    dniValido ? "border-gray-300" : "border-red-500"
                  }`}
                />
                {dniValido ? (
                  ""
                ) : (
                  <small className="text-red-500">Cédula no valida</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="nombre">Nombres</label>
                <br />
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                  className="w-full py-3 px-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellidos">Apellidos</label>
                <br />
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                  className="w-full py-3 px-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

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
                  className="w-full py-3 px-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$"
                  title="Ingrese un correo válido. Ej: micorreo@gmail.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <br />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full py-3 px-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Debe contener al menos un número y una letra mayúscula y minúscula, y al menos 8 o más caracteres"
                />
              </div>

              {/* Botones */}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg shadow hover:bg-purple-700 transition"
              >
                Crear una cuenta
              </button>
            </form>
            <button
              onClick={handleLogin}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg shadow hover:bg-gray-200 transition"
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Registrar;
