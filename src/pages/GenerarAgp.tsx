import React, { useEffect, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

import Navbar from "../components/Navbar";
import BackgroundPage from "../components/BackgroundPage";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import ValidateSession from "../components/ValidateSession";
import Cargador from "../components/Cargador";
import Swal from "sweetalert2";
import Config from "../components/Config";

interface CompradoresResponse {
  cod_comprador: number;
  identificacion_comprador: string;
}

interface FraccionBasicaResponse {
  cod_fraccion_basica: number;
  cod_periodo_fiscal: number;
  valor_fraccion_basica: number;
  created_at: string;
  periodo_fiscal: number;
}

interface AgpDatosLista {
  ruc_proveedor: string;
  base_imponible: number;
  cantidad_comprobantes: number;
  tipo_gasto: string;
}

function GenerarAgp() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    identificacion: "",
    cod_periodo_fiscal: "",
  });
  const [fraccionBasica, setFraccionBasica] = useState<
    FraccionBasicaResponse[]
  >([]);
  const [cargarLista, setCargarLista] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [getDatosAgp, setGetDatosAgp] = useState(false);
  const [agpDatos, setAgpDatos] = useState<AgpDatosLista[]>([]);
  const [mostrarBtnDescargar, setMostrarBtnDescargar] = useState(false);
  const [beneficiariaPension, setBeneficiariaPension] = useState<string>("");
  const [valorNoAsegurado, setValorNoAsegurado] = useState<string>("");

  //? Función para manejar el cambio en los campos del formulario
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

  //? consultar lista del AGP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGetDatosAgp(true);
    try {
      const response = await fetch(
        `${Config.apiBaseUrl}/agp_datos_lista/${formData.identificacion}/${formData.cod_periodo_fiscal}`,
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
        if (data.message) {
          Swal.fire(data.message);
          setAgpDatos([]);
          setMostrarBtnDescargar(false);
          // Guardar token para futuras solicitudes
          const new_token = response.headers.get("Authorization");
          localStorage.removeItem("token");
          localStorage.setItem("token", new_token!);
        } else {
          setAgpDatos(data);
          setMostrarBtnDescargar(true);
        }
      } else {
        Swal.fire(data.detail);
        console.error("Error:", data.detail);
      }
    } catch (error) {
      // Swal.fire("Hubo un error: " + error);
      console.error("Error:", error);
    } finally {
      setGetDatosAgp(false);
      setBeneficiariaPension("");
      setValorNoAsegurado("");
    }
  };

  const handleGenerarAgp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(beneficiariaPension);

    try {
      const response = await fetch(`${Config.apiBaseUrl}/generar_agp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify({
          identificacion_comprador: formData.identificacion,
          cod_periodo_fiscal: formData.cod_periodo_fiscal,
          beneficiariaPension,
          valorNoAsegurado,
        }),
      });

      if (response.ok) {
        // Convertir la respuesta a un Blob
        const blob = await response.blob();
        console.log(blob);

        // Obtener el filename desde los encabezados
        const filename = response.headers.get("filename");

        // Crear un enlace para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename!); // Usar el filename dinámico
        document.body.appendChild(link);
        link.click();
        // Limpiar el enlace
        document.body.removeChild(link);
        Swal.fire("Se ha descagado tu Anexo de Gastos Personales");

        // Guardar token para futuras solicitudes
        const new_token = response.headers.get("Authorization");
        localStorage.removeItem("token");
        localStorage.setItem("token", new_token!);
      } else {
        const data = await response.json();

        Swal.fire(data.detail);
        console.error("Error:", data.detail);
      }
    } catch (error) {
      // Swal.fire("Hubo un error: " + error);
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // obtener lista de Fraccion basica y periodo fiscal
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

          // Guardar token para futuras solicitudes
          const new_token = response.headers.get("Authorization");
          localStorage.removeItem("token");
          localStorage.setItem("token", new_token!);
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

  //para consultar los comporadrores
  const [compradores, setCompradores] = useState<CompradoresResponse[]>([]); // Estado para los datos formateados

  const { error, loading, tipoUsuario } = ValidateSession({
    route: "lista_compradores",
    method: "POST",
    setEstado: setCompradores,
  });

  if (loading) {
    return <Cargador />; // Mostrar un indicador de carga mientras valida
  }

  if (error) {
    console.log(error);
  }

  if (tipoUsuario && tipoUsuario != "cliente") navigate("/");

  return (
    <>
      <Navbar es_cliente={true} />
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Generar Anexo de Gastos Personales
          </h2>
        </div>

        <div className="flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-5xl">
            <p className="text-gray-600 text-center mb-4">
              Ingrese los datos para la consulta:
            </p>

            {/* Formulario */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Input principal */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* identificacion */}
                <div>
                  <label
                    htmlFor="identificacion"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Busca o selecciona un comprador:
                  </label>
                  <input
                    list="compradores-list"
                    id="identificacion"
                    name="identificacion"
                    value={formData.identificacion}
                    autoComplete="off"
                    onChange={handleChange}
                    required
                    placeholder="Escribe para buscar..."
                    pattern="[0-9]{10,13}"
                    min={10}
                    max={13}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <datalist id="compradores-list">
                    {compradores.map((comprador) => (
                      <option
                        key={comprador.cod_comprador}
                        value={comprador.identificacion_comprador}
                      />
                    ))}
                  </datalist>
                </div>
                {/* Periodo Fiscal*/}
                <div>
                  <label
                    htmlFor="cod_periodo_fiscal"
                    className="block text-gray-600 mb-1"
                  >
                    Periodo Fiscal
                  </label>
                  <select
                    id="cod_periodo_fiscal"
                    name="cod_periodo_fiscal"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.cod_periodo_fiscal || ""}
                    onChange={handleChange}
                    required
                  >
                    <option disabled value="">
                      Seleccionar
                    </option>
                    {fraccionBasica.map((fila) => (
                      <option
                        key={fila.cod_fraccion_basica}
                        value={fila.cod_periodo_fiscal}
                      >
                        Periodo {fila.periodo_fiscal} {" - $"}
                        {fila.valor_fraccion_basica.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg shadow hover:bg-gray-300 transition"
                >
                  Anterior
                </button>
                <button
                  type="submit"
                  disabled={getDatosAgp}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  {getDatosAgp ? (
                    <b className="my-auto">Espere... </b>
                  ) : (
                    "Consultar"
                  )}
                </button>
              </div>
            </form>
            {/* Tabla */}
            <table className="w-full table-auto border-collapse border border-gray-200 my-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">RUC Proveedor</th>
                  <th className="border px-4 py-2 text-left">
                    Cantidad De Comprobantes
                  </th>
                  <th className="border px-4 py-2 text-left">Base Imponible</th>
                  <th className="border px-4 py-2 text-left">Tipo De Gasto</th>
                </tr>
              </thead>
              <tbody>
                {agpDatos.message ? (
                  <tr>
                    <td colSpan={5}>{detalles.message}</td>
                  </tr>
                ) : (
                  <>
                    {agpDatos.map((fila, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">
                          <small>{fila.ruc_proveedor}</small>
                        </td>
                        <td className="border px-4 py-2">
                          <small>{fila.cantidad_comprobantes}</small>
                        </td>
                        <td className="border px-4 py-2">
                          $ {fila.base_imponible.toFixed(2)}
                        </td>
                        <td className="border px-4 py-2">{fila.tipo_gasto}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2} className="border px-4 py-2 ml-auto">
                        Total Gastos Personales
                      </td>
                      <td className="border px-4 py-2">
                        ${" "}
                        {agpDatos
                          .reduce((suma, fila) => suma + fila.base_imponible, 0)
                          .toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
            {mostrarBtnDescargar ? (
              <>
                <form className="space-y-6" onSubmit={handleGenerarAgp}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/*  Beneficiaria Pensión Alimenticia */}
                    <div>
                      <label
                        htmlFor="beneficiariaPension"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Beneficiaria Pensión Alimenticia:
                      </label>
                      <input
                        list="compradores-list"
                        id="beneficiariaPension"
                        name="beneficiariaPension"
                        value={beneficiariaPension}
                        autoComplete="off"
                        onChange={(
                          e: React.ChangeEvent<
                            HTMLInputElement | HTMLSelectElement
                          >
                        ) => setBeneficiariaPension(e.target.value)}
                        placeholder="Escribe para buscar si lo tiene..."
                        pattern="[0-9]{10,13}"
                        min={10}
                        max={13}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <datalist id="compradores-list">
                        {compradores.map((comprador) => (
                          <option
                            key={comprador.cod_comprador}
                            value={comprador.identificacion_comprador}
                          />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label
                        htmlFor="ValorNoAsegurado"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Valores No Cubierto Por Aseguradoras
                      </label>
                      <input
                        type="number"
                        id="ValorNoAsegurado"
                        value={valorNoAsegurado || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setValorNoAsegurado(e.target.value)
                        }
                        min={0}
                        max={999999}
                        step={0.01}
                        placeholder="Ingrese un valor si lo tiene..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    {isSubmitting ? (
                      <b className="my-auto">Espere... </b>
                    ) : (
                      <>
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                        Generar y Descargar Anexo de Gastos Personales
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default GenerarAgp;
