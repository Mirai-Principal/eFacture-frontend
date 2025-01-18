import React, { useEffect, useState } from "react";

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
  cod_fraccion_basica: number;
  categoria: string;
  descripcion_categoria: string;
  cant_fraccion_basica: number;
  created_at: string;
  valor_fraccion_basica: number;
  periodo_fiscal: number;
}

interface FraccionBasicaResponse {
  cod_fraccion_basica: number;
  cod_periodo_fiscal: number;
  valor_fraccion_basica: number;
  created_at: string;
  periodo_fiscal: number;
}

function Categorias() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    cod_categoria: 0,
    cod_fraccion_basica: "",
    categoria: "",
    descripcion_categoria: "",
    cant_fraccion_basica: "",
  });

  const [categorias, setCategorias] = useState<CategoriasResponse[]>([]);
  const [tituloForm, setTituloForm] = useState("Nueva Categoría");
  const [bloquearInputs, setBloquearInputs] = useState(false);
  const [fraccionBasica, setFraccionBasica] = useState<
    FraccionBasicaResponse[]
  >([]);
  const [cargarLista, setCargarLista] = useState(true);

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

  // obtener lista de Fraccion basica y periodo fiscal
  useEffect(() => {
    const consultarFraccionBasicaLista = async () => {
      try {
        const response = await fetch(`${Config.apiBaseUrl}/categorias_lista`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setCategorias(data);
          console.log(data);

          setCargarLista(false);
        } else {
          Swal.fire(data.detail);
          console.error("Error:", data.detail);
        }
      } catch (error) {
        Swal.fire("Hubo un error: " + error);
        console.error("Error:", error);
      }
    };
    consultarFraccionBasicaLista();
  }, [cargarLista]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        cod_fraccion_basica: categoria.cod_fraccion_basica,
      });
      setTituloForm("Editar Categoría");
      setBloquearInputs(true);
    };

  //valida la sesion
  const { error, loading, tipoUsuario, res } = ValidateSession({
    route: "fraccion_basica_list",
    method: "GET",
    setEstado: setFraccionBasica,
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
          <div className="bg-white p-6 rounded-lg shadow-xl mx-1  ">
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
                  Cantidad Fracción básica desgravada
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

              {/* Fraccion Basica - periodo fiscal */}
              <div className="mb-3">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="cod_fraccion_basica"
                >
                  Periodo Fiscal - Fracción básica desgravada
                </label>
                <select
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  id="cod_fraccion_basica"
                  name="cod_fraccion_basica"
                  value={formData.cod_fraccion_basica || ""}
                  onChange={handleChange}
                  required
                >
                  <option disabled value="">
                    Seleccionar
                  </option>

                  {res.message
                    ? res.message
                    : fraccionBasica.map((fila) => (
                        <option
                          key={fila.cod_fraccion_basica}
                          value={fila.cod_fraccion_basica}
                        >
                          Periodo {fila.periodo_fiscal} {" - $"}
                          {fila.valor_fraccion_basica.toFixed(2)}
                        </option>
                      ))}
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
          <div className="bg-white p-4 rounded-lg shadow-xl mx-1 min-h-full ">
            <h2 className="text-xl font-semibold mb-4">Lista de Categorías</h2>
            <div className="overflow-x-auto">
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
                      Cantidad Fracción básica
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Fracción básica
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Periodo Fiscal
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
                      <tr key={index} className={"hover:bg-gray-100"}>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          <small>{fila.categoria}</small>
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
                          {fila.valor_fraccion_basica}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {fila.periodo_fiscal}
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
      </div>
      <Footer />
    </>
  );
}

export default Categorias;
