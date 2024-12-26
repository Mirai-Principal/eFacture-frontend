import React, { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Config from "../components/Config";
import Cargador from "../components/Cargador";
import ValidateSession from "../components/ValidateSession";

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
        // credentials: "include", // Permite que las cookies y otros credenciales sean enviadas/recibidas
      });

      const data = await response.json();

      if (response.ok) {
        const token = response.headers.get("Authorization");
        const sub = response.headers.get("sub");

        localStorage.setItem("token", token); // Guardar token para futuras solicitudes
        // console.log(data);

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
      <div className="container contenido text-center">
        <div className="row">
          <div className="col-md-12 ">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit} className="w-50 mx-auto">
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
                  className="form-control"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$"
                  title="Ingrese un correo válido. Ej: micorreo@gmail.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <br />
                <input
                  type="password"
                  autoComplete="on"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <a href="/password_reset">Olvide mi contraseña</a>
              <button
                type="submit"
                className="register-btn btn btn-info form-control"
              >
                Ingresar
              </button>
            </form>
            <button
              onClick={handleRegister}
              className="btn btn-warning d-block w-50 my-2 mx-auto"
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
