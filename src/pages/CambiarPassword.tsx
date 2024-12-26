import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Swal from "sweetalert2";
import { Dialog } from "../components/Alerts";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Config from "../components/Config";

function CambiarPassword() {
  const navigate = useNavigate();

  const sesion = localStorage.getItem("token");

  // Obtener los parámetros de la URL
  const [searchParams] = useSearchParams();
  // Obtener valores de los query parameters
  const token = searchParams.get("k");

  useEffect(() => {
    if (sesion) {
      navigate("/"); // Redirige si no hay token
    }

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
            Authorization: `Bearer ${token}`,
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

    validate_token();
  }, [navigate]);

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null); // Para manejar errores

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
          Authorization: `Bearer ${token}`,
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
        Dialog(data.detail || "Se cambiado tu contraseña");
        // console.log(data);

        navigate("/login");
      }
    } catch (err) {
      //   console.error("Error:", err);
      setError("Hubo un error al procesar la solicitud");
      Swal.fire(`${"Hubo un error al procesar la solicitud"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-5">
              <div className="card-header text-center">
                <h2>Cambiar Contraseña</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} method="POST">
                  <div className="form-group">
                    <label htmlFor="password">Nueva Contraseña</label>
                    <input
                      type="password"
                      autoComplete="off"
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
                  <div className="form-group">
                    <label htmlFor="confirm_password">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      autoComplete="off"
                      id="confirm_password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                      className="form-control"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Debe contener al menos un número y una letra mayúscula y minúscula, y al menos 8 o más caracteres"
                    />
                  </div>
                  {formData.password === formData.confirm_password ? (
                    ""
                  ) : (
                    <small className="text-danger">
                      La contraseña no es igual
                    </small>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="form-control btn btn-info btn-block"
                  >
                    Cambiar Contraseña
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CambiarPassword;
