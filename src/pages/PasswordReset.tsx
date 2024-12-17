import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";

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

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviar los datos al backend usando fetch
      const response = await fetch("http://localhost:8000/password_reset", {
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
        console.log(data);

        Swal.fire(data);

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
      <div className="container contenido text-center">
        <div className="row my-4">
          <div className="col-md-12 ">
            <h2>Recuperar contraseña</h2>
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
                  className="form-control border-0 border-bottom py-1 my-2 border border-dark"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,10}$"
                  title="Ingrese un correo válido. Ej: micorreo@gmail.com"
                />
              </div>
              <button
                type="submit"
                className="register-btn btn btn-info form-control"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <b className="my-auto">Espere... </b>
                    <div className="spinner-border " role="status">
                      <span className="visually-hidden">Espere...</span>
                    </div>
                  </>
                ) : (
                  "Enviar"
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
