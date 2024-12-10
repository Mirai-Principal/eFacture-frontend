import React, { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Registrar = () => {
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

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container text-center">
      <div className="row bg-secondary text-white">
        <h1>Bienvenidos a eFacture</h1>
      </div>
      <div className="row my-4">
        <div className="col-md-12 ">
          <h2>Registro de Usuario</h2>
          <form onSubmit={handleSubmit} className="w-50 mx-auto">
            <div className="form-group">
              <label htmlFor="identificacion">Identificación</label>
              <br />
              <input
                type="text"
                id="identificacion"
                name="identificacion"
                value={formData.identificacion}
                onChange={handleChange}
                required
                placeholder="Cedula / RUC"
                pattern="[0-9]{10,13}"
                title="Solo números del 0 al 9. Ej: 0202432143001"
                className="form-control"
              />
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
                className="form-control"
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
                className="form-control"
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
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-control"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Debe contener al menos un número y una letra mayúscula y minúscula, y al menos 8 o más caracteres"
              />
            </div>

            <button
              type="submit"
              className="register-btn btn btn-warning form-control"
            >
              Registrar
            </button>
          </form>
          <button
            onClick={handleLogin}
            className="btn btn-info d-block w-50 my-2 mx-auto"
          >
            Ingresar
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Registrar;
