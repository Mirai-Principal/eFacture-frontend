import React, { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/navbar";

const Login = () => {
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

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(formData);

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token); // Guardar token para futuras solicitudes

        // Swal.fire(`Autenticación exitosa`);
        navigate("/panel_cliente");
      } else {
        Swal.fire(`${data.detail}`);
      }
    } catch (err) {
      Swal.fire(`Error de red`);
    }
  };

  const navigate = useNavigate();
  const handleRegister = () => {
    navigate("/registrar");
  };

  return (
    <div className="container text-center">
      <Navbar />
      <div className="row my-4">
        <div className="col-md-12 ">
          <h2>Registro de Usuario</h2>
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

      <Footer />
    </div>
  );
};

export default Login;
