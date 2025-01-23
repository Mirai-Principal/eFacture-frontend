import React, { useEffect, useState } from "react";
import Cargador from "../../components/Cargador";
import ValidateSession from "../../components/ValidateSession";
import { useNavigate } from "react-router-dom";
import BackgroundPage from "../../components/BackgroundPage";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Config from "../../components/Config";
import Swal from "sweetalert2";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Toast } from "../../components/Alerts";

interface PeriodoFiscalResponse {
  cod_periodo_fiscal: number;
  periodo_fiscal: number;
  created_at: string;
}

interface FraccionBasicaResponse {
  cod_fraccion_basica: number;
  cod_periodo_fiscal: number;
  valor_fraccion_basica: number;
  created_at: string;
  periodo_fiscal: number;
}
function FraccionBasica() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  //? ESTADOS
  const [formData, setFormData] = useState({
    cod_fraccion_basica: 0,
    cod_periodo_fiscal: "",
    valor_fraccion_basica: "",
    periodo_fiscal: 0,
  });

  const [periodoFiscal, setPeriodoFiscal] = useState<PeriodoFiscalResponse[]>(
    []
  );
  const [fraccionBasica, setFraccionBasica] = useState<
    FraccionBasicaResponse[]
  >([]);
  const [cargarLista, setCargarLista] = useState(true);
  const [sortAscending, setSortAscending] = useState(true);
  const [cargarListaPeriodo, setCargarListaPeriodo] = useState(true);
  const [tituloForm, setTituloForm] = useState(
    "Nueva Fracción básica desgravada IR"
  );
  const [bloquearInputs, setBloquearInputs] = useState(false);

  //? PETICIONES HTTP

  // eliminar registros
  const handleDelete =
    (cod_fraccion_basica: number) => async (e: React.MouseEvent) => {
      e.preventDefault();

      try {
        const response = await fetch(
          `${Config.apiBaseUrl}/fraccion_basica_delete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token!,
            },
            body: JSON.stringify({ cod_fraccion_basica }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          Toast({ title: "Fracción básica eliminada" });
          if (data.message) window.location.reload();
          else {
            setFraccionBasica(data);
            setCargarListaPeriodo(true);
          }
        } else {
          Swal.fire(data.detail);
          console.error("Error:", data.detail);
        }
      } catch (error) {
        Swal.fire("Hubo un error: " + error);
        console.error("Error:", error);
      }
    };

  // obtener lista de Fraccion basica
  useEffect(() => {
    const consultarFraccionBasicaLista = async () => {
      try {
        const response = await fetch(
          `${Config.apiBaseUrl}/fraccion_basica_list`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token!,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setFraccionBasica(data);
          setCargarLista(false);
        } else {
          Swal.fire(data.detail);
          console.error("Error:", data.detail);
        }
      } catch (error) {
        // Swal.fire("Hubo un error: " + error);
        console.error("Error:", error);
      }
    };
    consultarFraccionBasicaLista();
  }, [cargarLista]);

  // obtener lista periodo fiscal
  useEffect(() => {
    const consultar = async () => {
      try {
        const response = await fetch(
          `${Config.apiBaseUrl}/periodo_fiscal_lista_select`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token!,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setPeriodoFiscal(data);
          setCargarListaPeriodo(false);
        } else {
          Swal.fire(data.detail);
          console.error("Error:", data.detail);
        }
      } catch (error) {
        // Swal.fire("Hubo un error: " + error);
        console.error("Error:", error);
      }
    };
    consultar();
  }, [cargarListaPeriodo]);

  // valida la sesion
  const { error, loading, tipoUsuario, res } = ValidateSession({
    route: "periodo_fiscal_lista_select",
    method: "GET",
    setEstado: setPeriodoFiscal,
  });

  if (loading) {
    return <Cargador />; // Mostrar un indicador de carga mientras valida
  }

  if (error) {
    console.log(error);
  }

  if (tipoUsuario && tipoUsuario != "admin") navigate("/");

  const today = new Date();
  const anioActual = today.toISOString().slice(0, 4); // Esto extrae "YYYY"

  // Para obtener el siguiente año (sumando 1 año)
  // const nextYearMonth = new Date(today.setFullYear(today.getFullYear() + 1))
  //   .toISOString()
  //   .slice(0, 7);

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // para ordenar la tabla
  const handleSort = () => {
    const sortedData = [...fraccionBasica].sort((a, b) => {
      const valorA = a.periodo_fiscal;
      const valorB = b.periodo_fiscal;
      return sortAscending ? valorA - valorB : valorB - valorA;
    });
    setSortAscending(!sortAscending);
    setFraccionBasica(sortedData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${Config.apiBaseUrl}/fraccion_basica_insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(data);

        // Toast({ title: data.message });

        setCargarLista(true);
        setCargarListaPeriodo(true);
        //reset form
        setFormData({
          cod_fraccion_basica: 0,
          cod_periodo_fiscal: "",
          valor_fraccion_basica: "",
          periodo_fiscal: 0,
        });
      } else {
        Swal.fire(data.detail);
        console.error("Error:", data.detail);
      }
    } catch (error) {
      Swal.fire("Hubo un error: " + error);
      console.error("Error:", error);
    } finally {
      setBloquearInputs(false);
      setTituloForm("Nueva Fracción básica desgravada IR");
    }
  };

  const handleEdit =
    (datos: FraccionBasicaResponse) => async (e: React.MouseEvent) => {
      e.preventDefault();
      // console.log(categoria);
      setFormData({
        cod_fraccion_basica: datos.cod_fraccion_basica,
        cod_periodo_fiscal: datos.cod_periodo_fiscal,
        valor_fraccion_basica: datos.valor_fraccion_basica,
        periodo_fiscal: datos.periodo_fiscal,
      });
      setTituloForm("Editar Fracción básica desgravada IR ");
      setBloquearInputs(true);
    };

  return (
    <>
      <Navbar es_admin={true} />
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Fracción básica desgravada IR
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-10 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-2">
          {/* Columna 1: Formulario */}
          <div className="bg-white p-6 rounded-lg shadow-xl mx-1">
            <h2 className="text-xl font-semibold mb-4">{tituloForm}</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="periodo_fiscal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Valor Fracción básica desgravada IR
                </label>
                <input
                  type="number"
                  id="valor_fraccion_basica"
                  value={formData.valor_fraccion_basica}
                  min={0}
                  max={99999999.99}
                  step={0.01}
                  onChange={handleChange}
                  tabIndex={1}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              {/* Periodo fiscal */}
              <div className="mb-3">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="cod_periodo_fiscal"
                >
                  Periodo Fiscal
                </label>
                <label style={bloquearInputs ? {} : { display: "none" }}>
                  {formData.periodo_fiscal}
                </label>
                <select
                  className="mt-1 p-2 w-full border  border-gray-300 rounded-md shadow-sm"
                  id="cod_periodo_fiscal"
                  name="cod_periodo_fiscal"
                  value={formData.cod_periodo_fiscal || ""}
                  onChange={handleChange}
                  required
                  disabled={bloquearInputs}
                  style={bloquearInputs ? { display: "none" } : {}}
                >
                  <option disabled value="">
                    Seleccionar
                  </option>

                  {res.message
                    ? res.message
                    : periodoFiscal.length > 0
                    ? periodoFiscal.map((periodo, index) => (
                        <option
                          key={periodo.cod_periodo_fiscal}
                          value={periodo.cod_periodo_fiscal}
                        >
                          {periodo.periodo_fiscal}
                        </option>
                      ))
                    : ""}
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

          {/* Columna 2: Tabla Periodo Fiscal */}
          <div className="bg-white p-6 rounded-lg 500 shadow-xl mx-1 min-h-full">
            <h2 className="text-xl font-semibold mb-4">
              Lista Fracción Basica
            </h2>
            <table className="min-w-full table-auto border-collapse  min-h-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={handleSort}
                    >
                      Periodo Fiscal
                      {sortAscending ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      )}
                    </div>
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Fracción básica
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Fecha Registro
                  </th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fraccionBasica.message ? (
                  <tr>
                    <td colSpan={4}>{fraccionBasica.message}</td>
                  </tr>
                ) : (
                  fraccionBasica.map((fila, index) => (
                    <tr
                      key={index}
                      className={
                        fila.periodo_fiscal == Number(anioActual)
                          ? "bg-green-100"
                          : "hover:bg-gray-100"
                      }
                    >
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {fila.periodo_fiscal}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {fila.valor_fraccion_basica.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {fila.created_at}
                      </td>
                      <td>
                        {fila.periodo_fiscal == 9999 ? (
                          ""
                        ) : (
                          <a href="#" onClick={handleEdit(fila)}>
                            <PencilIcon className="h-5 w-5 mr-2" />
                          </a>
                        )}
                      </td>
                      <td>
                        {fila.periodo_fiscal == 9999 ? (
                          ""
                        ) : (
                          <a
                            href="#"
                            onClick={handleDelete(fila.cod_fraccion_basica)}
                          >
                            <TrashIcon className="h-5 w-5 mr-2" />
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

export default FraccionBasica;
