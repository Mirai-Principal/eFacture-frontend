import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ValidateSession from "../../components/ValidateSession";
import Cargador from "../../components/Cargador";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import Config from "../../components/Config";

const NuevaMembresia = () => {
  const navigate = useNavigate();

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    nombre_membresia: "",
    descripcion_membresia: "",
    precio: "",
    cant_comprobantes_carga: "",
    estado: "disponible",
    fecha_lanzamiento: "",
    vigencia_meses: "",
    fecha_finalizacion: "2025-12-19",
  });

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //valida la sesion
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
  if (tipoUsuario && tipoUsuario != "admin") navigate("/");

  // Obtener la fecha actual en formato 'YYYY-MM-DD'
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // Enviar los datos al backend usando fetch
      const response = await fetch(`${Config.apiBaseUrl}/nueva_membresia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const data = await response.json();
        // console.log(data.detail);
        Swal.fire(data.detail);
      } else {
        const data = await response.json();
        // console.log(data);
        Swal.fire(data.detail);
        navigate("/lista_membresias");
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire("Hubo un error al procesar la solicitud");
    }
  };

  return (
    <>
      <Navbar es_admin={true} />

      <div className="container contenido py-4">
        <div className="row text-center">
          <h2>Registro de Membresía</h2>
        </div>
        <div className="row">
          <form onSubmit={handleSubmit}>
            {/* Nombre Membresía */}
            <div className="mb-3">
              <label className="form-label" htmlFor="nombre_membresia">
                Nombre de la Membresía
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre_membresia"
                name="nombre_membresia"
                value={formData.nombre_membresia}
                onChange={handleChange}
                required
              />
            </div>

            {/* Descripción Membresía */}
            <div className="mb-3">
              <label className="form-label" htmlFor="descripcion_membresia">
                Descripción de la Membresía
              </label>
              <textarea
                className="form-control"
                id="descripcion_membresia"
                name="descripcion_membresia"
                value={formData.descripcion_membresia}
                onChange={handleChange}
                rows={3}
                required
              ></textarea>
            </div>

            {/* Precio */}
            <div className="mb-3">
              <label className="form-label" htmlFor="precio">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                min={0}
                required
              />
            </div>

            {/* Cantidad de Comprobantes */}
            <div className="mb-3">
              <label className="form-label" htmlFor="cant_comprobantes_carga">
                Cantidad de Comprobantes de Carga
              </label>
              <input
                type="number"
                className="form-control"
                id="cant_comprobantes_carga"
                name="cant_comprobantes_carga"
                value={formData.cant_comprobantes_carga}
                onChange={handleChange}
                min={0}
                required
              />
            </div>

            {/* Estado */}
            <div className="mb-3">
              <label className="form-label" htmlFor="estado">
                Estado
              </label>
              <select
                className="form-select"
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
              >
                <option value="disponible">Disponible</option>
                <option value="no disponible">No Disponible</option>
              </select>
            </div>

            {/* Fecha de Lanzamiento */}
            <div className="mb-3">
              <label className="form-label" htmlFor="fecha_lanzamiento">
                Fecha de Lanzamiento
              </label>
              <input
                type="date"
                className="form-control"
                id="fecha_lanzamiento"
                name="fecha_lanzamiento"
                value={formData.fecha_lanzamiento}
                onChange={handleChange}
                min={today}
                required
              />
            </div>

            {/* Vigencia en Meses */}
            <div className="mb-3">
              <label className="form-label" htmlFor="vigencia_meses">
                Vigencia (Meses)
              </label>
              <input
                type="number"
                className="form-control"
                id="vigencia_meses"
                name="vigencia_meses"
                value={formData.vigencia_meses}
                onChange={handleChange}
                min={0}
                required
              />
            </div>

            {/* Botón de Enviar */}
            <button type="submit" className="btn btn-primary form-control">
              Registrar Membresía
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NuevaMembresia;
