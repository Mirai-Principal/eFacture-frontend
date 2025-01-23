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
} from "@heroicons/react/24/solid";
import { Toast } from "../../components/Alerts";

interface PeriodoFiscalResponse {
  cod_periodo_fiscal: number;
  periodo_fiscal: number;
  created_at: string;
}
function PeriodoFiscal() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ESTADOS
  const [formData, setFormData] = useState({
    periodo_fiscal: 0,
  });

  const [periodoFiscal, setPeriodoFiscal] = useState<PeriodoFiscalResponse[]>(
    []
  );
  const [sortAscending, setSortAscending] = useState(true);
  const [cargarLista, setCargarLista] = useState(true);

  // PETICIONES HTTP

  // obtener lista/tabla periodo fiscal
  useEffect(() => {
    const consultar = async () => {
      try {
        const response = await fetch(
          `${Config.apiBaseUrl}/periodo_fiscal_lista`,
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
    consultar();
  }, [cargarLista]);

  // eliminar registros
  const handleDelete =
    (cod_periodo_fiscal: number) => async (e: React.MouseEvent) => {
      e.preventDefault();

      try {
        const response = await fetch(
          `${Config.apiBaseUrl}/periodo_fiscal_delete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token!,
            },
            body: JSON.stringify({ cod_periodo_fiscal }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          Toast({ title: "Periodo Fiscal eliminado" });
          if (data.message) {
            window.location.reload();
          } else setPeriodoFiscal(data);
        } else {
          Swal.fire(data.detail);
          console.error("Error:", data.detail);
        }
      } catch (error) {
        Swal.fire("Hubo un error: " + error);
        console.error("Error:", error);
      }
    };

  // valida la sesion
  const { error, loading, tipoUsuario, res } = ValidateSession({
    route: "periodo_fiscal_lista",
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
  console.log(periodoFiscal);

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
    const sortedData = [...periodoFiscal].sort((a, b) => {
      const valorA = a.periodo_fiscal;
      const valorB = b.periodo_fiscal;
      return sortAscending ? valorA - valorB : valorB - valorA;
    });
    setSortAscending(!sortAscending);
    setPeriodoFiscal(sortedData);
  };
  //crear nueva entrada
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${Config.apiBaseUrl}/periodo_fiscal_insert`,
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
        Swal.fire(data.message);
        setCargarLista(true);
        setFormData({ periodo_fiscal: 0 });
      } else {
        Swal.fire(data.detail);
        console.error("Error:", data.detail);
      }
    } catch (error) {
      Swal.fire("Hubo un error: " + error);
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar es_admin={true} />
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Periodo Fiscal
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-10 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-2">
          {/* Columna 1: Formulario */}
          <div className="bg-white p-6 rounded-lg shadow-xl mx-1">
            <h2 className="text-xl font-semibold mb-4">Nuevo Periodo Fiscal</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="periodo_fiscal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Periodo Fiscal
                </label>
                <input
                  type="number"
                  id="periodo_fiscal"
                  value={formData.periodo_fiscal}
                  min={2021}
                  max={Number(anioActual) + 1}
                  onChange={handleChange}
                  tabIndex={1}
                  onInvalid={(e) => {
                    (e.target as HTMLInputElement).setCustomValidity(
                      `El valor debe estar entre 2021 y ${
                        Number(anioActual) + 1
                      }.\n Por favor, inténtalo de nuevo.`
                    );
                  }}
                  onInput={(e) => {
                    // Limpia el mensaje personalizado al corregir el input
                    (e.target as HTMLInputElement).setCustomValidity("");
                  }}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  required
                />
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
            <h2 className="text-xl font-semibold mb-4">Lista Periodo Fiscal</h2>
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
                    Fecha Registro
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {res.message ? (
                  <tr>
                    <td colSpan={2}>{res.message}</td>
                  </tr>
                ) : (
                  periodoFiscal.map((fila, index) => (
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
                        {fila.created_at.slice(0, 10)}
                      </td>
                      <td>
                        {/* no eliminar si es dumie */}
                        {fila.periodo_fiscal == 9999 ? (
                          ""
                        ) : (
                          <a
                            href="#"
                            onClick={handleDelete(fila.cod_periodo_fiscal)}
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

export default PeriodoFiscal;
