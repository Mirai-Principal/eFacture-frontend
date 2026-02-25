import React, { useEffect, useState } from "react";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cargador from "../components/Cargador";
import { useNavigate } from "react-router-dom";
import ValidateSession from "../components/ValidateSession";
import Config from "../components/Config";
import Swal from "sweetalert2";
import BackgroundPage from "../components/BackgroundPage";

interface CompradoresResponse {
  cod_comprador: number;
  identificacion_comprador: string;
}

interface CategoriasResponse {
  categoria: string;
}

const backgroundColor = [
  "rgb(255, 99, 132)", // Rojo
  "rgb(54, 162, 235)", // Azul
  "rgb(255, 205, 86)", // Amarillo
  "rgb(75, 192, 192)", // Verde agua
  "rgb(153, 102, 255)", // Morado
  "rgb(255, 159, 64)", // Naranja
  "rgb(201, 203, 207)", // Gris claro
];

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

interface DatosPrediccionMensual {
  anio: number;
  monto: number;
}

function PrediccionGastos() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  //? ESTADOS
  const [selectedMonth, setSelectedMonth] = useState(0); // Enero por defecto

  //prediccion
  const [etiquetas, setEtiquetas] = useState<string[]>([]);
  const [datos, setDatos] = useState<number[]>([]);
  const [etiquetasHistorico, setEtiquetasHistorico] = useState<string[]>([]);
  const [datosHistorico, setDatosHistorico] = useState<number[]>([]);
  //historico

  const [isSubmitting, setIsSubmitting] = useState(false); //estado de carga
  const [categorias, setCategorias] = useState<CategoriasResponse[]>([]);

  const [formData, setFormData] = useState({
    usuario: "",
    categoria: "",
  });

  const [activarSlider, setActivarSlider] = useState(true);
  const [datosMensual, setdatosMensual] = useState<DatosPrediccionMensual[]>(
    []
  );

  //! GRAFICO ESTADISITCO
  //? mensual
  const dataPrediccion = {
    labels: etiquetas,
    datasets: [
      {
        label: "Predicción de Gastos",
        data: datos,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
  const dataHistorico = {
    labels: etiquetasHistorico,
    datasets: [
      {
        label: "Histórico de Gastos",
        data: datosHistorico,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  //? categorico
  const dataMensual = {
    labels: datosMensual?.map((fila) => fila.anio) || [],
    datasets: [
      {
        label: "Histórico de Gastos",
        data: datosMensual?.map((fila) => fila.monto) || [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: backgroundColor,
      },
    ],
  };

  //? PETICIONES HTTP

  // get categorias
  useEffect(() => {
    (async () => {
      setIsSubmitting(true);

      try {
        // Enviar los datos al backend usando fetch
        const response = await fetch(
          `${Config.apiBaseUrl}/categorias_unicas_get`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token!,
            },
          }
        );

        // Verificar si la respuesta es exitosa
        const data = await response.json();

        if (response.ok) {
          setCategorias(data);
          console.log(data);
        } else {
          Swal.fire(data.detail || "Error al enviar los datos");
        }
      } catch (err) {
        console.error("Error:", err);
        // Swal.fire(`Hubo un error al procesar la solicitud`);
        // window.location.reload();
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, []);

  const handleChangeSlider = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let mes = parseInt(event.target.value);
    setSelectedMonth(mes);
    setIsSubmitting(true);
    const categoria = formData.categoria;
    mes += 1;

    try {
      // Enviar los datos al backend usando fetch
      const response = await fetch(
        `${Config.apiBaseUrl}/consultar_categorico_mensual/${categoria}/${mes}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
        }
      );

      // Verificar si la respuesta es exitosa
      const data = await response.json();

      if (response.ok) {
        setdatosMensual(data);
        console.log(data);
      } else {
        console.log(data);

        Swal.fire(data.detail || "Error al enviar los datos");
      }
    } catch (err) {
      console.error("Error:", err);
      // Swal.fire(`Hubo un error al procesar la solicitud`);
      // window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  };

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

  //? consultar datos de prediccion e historial
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setdatosMensual([]);

    const categoria = formData.categoria;
    const usuario = formData.usuario;
    await consultarDatos("consultar_prediccion", usuario, categoria).then(
      (data) => {
        if (data.message) {
          Swal.fire(data.message);
          setEtiquetas([]);
          setDatos([]);
        } else {
          setEtiquetas(data.map((fila: any) => fila.fecha.slice(0, 7)));
          setDatos(data.map((fila: any) => fila.monto));
        }
      }
    );

    await consultarDatos("consultar_historico", usuario, categoria).then(
      (data) => {
        if (data.message) {
          setEtiquetasHistorico([]);
          setDatosHistorico([]);
        } else {
          setEtiquetasHistorico(data.map((fila: any) => fila.anio_mes.slice(0, 7)));
          setDatosHistorico(data.map((fila: any) => fila.monto));
        }
      }
    );
  };

  const consultarDatos = async (
    path: string,
    usuario: string,
    categoria: string = ""
  ) => {
    try {
      const response = await fetch(
        `${Config.apiBaseUrl}/${path}/${usuario}/${categoria}`,
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
        setActivarSlider(false);

        const new_token = response.headers.get("Authorization");
        localStorage.removeItem("token");
        localStorage.setItem("token", new_token!);
        return data;
      } else {
        Swal.fire(data.detail);
        console.error("Error:", data.detail);
      }
    } catch (error) {
      Swal.fire("Hubo un error: " + error);
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  //valida la sesion
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

      {isSubmitting ? <Cargador message="Espere un momento..." /> : null}
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Predcción de Gastos Personales
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
                {/* usuario */}
                <div>
                  <label
                    htmlFor="usuario"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Busca o selecciona un comprador:
                  </label>
                  <input
                    list="compradores-list"
                    id="usuario"
                    value={formData.usuario}
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
                {/* categoria*/}
                <div>
                  <label
                    htmlFor="categoria"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Seleciona una categoría:
                  </label>

                  <select
                    id={`categoria`}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                  >
                    <option disabled value="">
                      Seleccionar
                    </option>
                    {categorias.map((categoria, index) => (
                      <option key={index} value={categoria.categoria}>
                        {categoria.categoria}
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
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  {isSubmitting ? (
                    <b className="my-auto">Espere... </b>
                  ) : (
                    "Consultar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mx-auto mt-5 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-5 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-xl m-1  ">
            <Chart type="line" data={dataHistorico} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-xl m-1  ">
            <Chart type="line" data={dataPrediccion} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-xl mx-auto mt-5 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-5 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-1">
          <div className="  p-6 w-full my-5">
            <label className="block text-gray-700 font-bold mb-2">
              Seleccionar Mes
            </label>

            <input
              type="range"
              min="0"
              max="11"
              step="1"
              value={selectedMonth}
              onChange={(e) => {
                handleChangeSlider(e);
              }}
              disabled={activarSlider}
              className="w-full accent-indigo-600"
            />

            <div className="flex justify-between text-gray-500 mt-2">
              <span className="text-xs text-center w-full">
                {months[selectedMonth]}
              </span>
            </div>
          </div>
          <div className=" p-6  m-1 text-center ">
            <p>Meses por año</p>
            <Chart type="bar" data={dataMensual} className="w-10/12 mx-auto" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default PrediccionGastos;
