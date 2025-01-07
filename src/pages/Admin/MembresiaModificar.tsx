import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ValidateSession from "../../components/ValidateSession";
import Cargador from "../../components/Cargador";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";
import Config from "../../components/Config";
import BackgroundPage from "../../components/BackgroundPage";

const MembresiaModificar = () => {
  const navigate = useNavigate();

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    nombre_membresia: "",
    descripcion_membresia: "",
    caracterisicas: "",
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
  const { cod_membresia } = useParams<{ cod_membresia: string }>();

  const { error, res, loading, tipoUsuario } = ValidateSession({
    route: `visualizar_membresia/${cod_membresia}`,
    method: "GET",
    setEstado: setFormData,
  });

  if (loading) {
    return <Cargador />; // Mostrar un indicador de carga mientras valida
  }

  if (error) {
    console.log(error);
  }
  if (tipoUsuario != "admin") navigate("/");

  // Obtener la fecha actual en formato 'YYYY-MM-DD'
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Datos del formulario:", formData);

    const token = localStorage.getItem("token");

    try {
      // Enviar los datos al backend usando fetch
      const response = await fetch(
        `${Config.apiBaseUrl}/actualizar_membresia`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(formData),
        }
      );
      // Verificar si la respuesta es exitosa
      const data = await response.json();

      if (response.ok) {
        Swal.fire(data.message);
        navigate("/lista_membresias");
      } else {
        Swal.fire(data.detail);
        console.error("Error:", data.detail);
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire(`${err}`);

      //   setError("Hubo un error al procesar la solicitud");
    }
  };

  return (
    <>
      <Navbar es_admin={true} />

      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            Actualizar Membresía
          </h2>
        </div>
        <div className="mx-auto mt-16  max-w-lg  items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
          {/* Columna 1: Formulario */}
          <div className="bg-white p-6 rounded-lg shadow-md mx-auto">
            <form onSubmit={handleSubmit}>
              {/* Nombre Membresía */}
              <div className="mb-3">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="nombre_membresia"
                >
                  Nombre de la Membresía
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  id="nombre_membresia"
                  name="nombre_membresia"
                  value={formData.nombre_membresia}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Descripción Membresía */}
              <div className="mb-3">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="descripcion_membresia"
                >
                  Descripción de la Membresía
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  id="descripcion_membresia"
                  name="descripcion_membresia"
                  value={formData.descripcion_membresia}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* caracteristicas Membresía */}
              <div className="mb-3">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="caracteristicas"
                >
                  Caracteristicas de la Membresía
                  <br />
                  <small>Poner cada característica en una linea</small>
                </label>
                <textarea
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  id="caracteristicas"
                  name="caracteristicas"
                  value={formData.caracteristicas}
                  onChange={handleChange}
                  rows={3}
                  required
                ></textarea>
              </div>

              {/* Precio */}
              <div className="mb-3">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="precio"
                >
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
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
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="cant_comprobantes_carga"
                >
                  Cantidad de Comprobantes de Carga
                </label>
                <input
                  type="number"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
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
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="estado"
                >
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
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="fecha_lanzamiento"
                >
                  Fecha de Lanzamiento
                </label>
                <input
                  type="date"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
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
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="vigencia_meses"
                >
                  Vigencia (Meses)
                </label>
                <input
                  type="number"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  id="vigencia_meses"
                  name="vigencia_meses"
                  value={formData.vigencia_meses}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
              >
                Registrar
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MembresiaModificar;
