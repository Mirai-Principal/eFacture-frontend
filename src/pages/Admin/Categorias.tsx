import React, { useState } from "react";

import { PencilIcon } from "@heroicons/react/24/outline"; // También puedes usar '/solid'

import BackgroundPage from "../../components/BackgroundPage";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import Cargador from "../../components/Cargador";
import ValidateSession from "../../components/ValidateSession";
import Swal from "sweetalert2";
import Config from "../../components/Config";

interface CategoriasResponse {
  cod_categoria: number;
  categoria: string;
  descripcion_categoria: string;
  cant_fraccion_basica: number;
  created_at: string;
  estado: string;
}

function Categorias() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    cod_categoria: 0,
    categoria: "",
    descripcion_categoria: "",
    cant_fraccion_basica: "",
    estado: "disponible",
  });

  const [categorias, setCategorias] = useState<CategoriasResponse[]>([]);
  const [tituloForm, setTituloForm] = useState("Nueva Categoría");
  const [bloquearInputs, setBloquearInputs] = useState<boolean>(false);

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(formData);

    try {
      const response = await fetch(`${Config.apiBaseUrl}/categorias_insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire(data.message);
        window.location.reload();
      } else {
        Swal.fire(data.detail);
        console.error("Error:", data.detail);
      }
    } catch (error) {
      Swal.fire("Hubo un error: " + error);
      console.error("Error:", error);
    }
  };

  const handleEdit =
    (categoria: CategoriasResponse) => async (e: React.MouseEvent) => {
      e.preventDefault();
      // console.log(categoria);
      setFormData({
        cod_categoria: categoria.cod_categoria,
        categoria: categoria.categoria,
        descripcion_categoria: categoria.descripcion_categoria,
        cant_fraccion_basica: categoria.cant_fraccion_basica.toString(),
        estado: categoria.estado,
      });
      setTituloForm("Editar Categoría");
      setBloquearInputs(true);
    };

  //valida la sesion
  const { error, loading, tipoUsuario, res } = ValidateSession({
    route: "categorias_lista",
    method: "GET",
    setEstado: setCategorias,
  });
  if (loading) {
    return <Cargador />; // Mostrar un indicador de carga mientras valida
  }
  if (error) {
    console.log(error);
  }
  if (tipoUsuario && tipoUsuario != "admin") navigate("/");

  return (
    <>
      <Navbar es_admin={true} />
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Categorias de comprobante electrónicos
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-10 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-2">
          {/* Columna 1: Formulario */}
          <div className="bg-white p-6 rounded-lg shadow-md mx-1">
            <h2 className="text-xl font-semibold mb-4">{tituloForm}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="categoria"
                  className="block text-sm font-medium text-gray-700"
                >
                  Categoría
                </label>
                <input
                  type="text"
                  id="categoria"
                  value={formData.categoria}
                  maxLength={50}
                  onChange={handleChange}
                  disabled={bloquearInputs}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="descripcion_categoria"
                  className="block text-sm font-medium text-gray-700"
                >
                  Descripción de la Categoría
                </label>
                <textarea
                  className="fmt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  id="descripcion_categoria"
                  name="descripcion_categoria"
                  value={formData.descripcion_categoria}
                  onChange={handleChange}
                  rows={3}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="cant_fraccion_basica"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fracción básica desgravada
                </label>
                <input
                  type="number"
                  id="cant_fraccion_basica"
                  value={formData.cant_fraccion_basica}
                  min={0}
                  max={100}
                  step={0.001}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
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
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
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

              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
              >
                Guardar
              </button>
            </form>
          </div>

          {/* Columna 2: Tabla de Categorías */}
          <div className="bg-white p-4 rounded-lg shadow-md mx-1 min-h-full">
            <h2 className="text-xl font-semibold mb-4">Lista de Categorías</h2>
            <table className="min-w-full table-auto border-collapse  min-h-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Categoría
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Descripción
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Cantidad Fracción básica desgravada
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Estado
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {res.message ? (
                  <tr>
                    <td colSpan={3}>{res.message}</td>
                  </tr>
                ) : (
                  categorias.map((fila, index) => (
                    <tr
                      key={index}
                      className={
                        fila.estado == "no disponible"
                          ? "bg-red-100"
                          : "hover:bg-gray-100"
                      }
                    >
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {fila.categoria}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        <small>
                          {fila.descripcion_categoria.slice(0, 20) + "..."}
                        </small>
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {fila.cant_fraccion_basica}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {fila.estado}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {fila.categoria == "Desconocido" ? (
                          ""
                        ) : (
                          <a href="#" onClick={handleEdit(fila)}>
                            <PencilIcon className="h-5 w-5 mr-2" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Categorias;
