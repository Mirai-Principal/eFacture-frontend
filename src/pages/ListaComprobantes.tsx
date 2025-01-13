import React, { ChangeEvent, useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import Cargador from "../components/Cargador";
import ValidateSession from "../components/ValidateSession";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BackgroundPage from "../components/BackgroundPage";
import Swal from "sweetalert2";
import Config from "../components/Config";

interface Comprobante {
  cod_comprobante: number;
  cod_comprador: number;
  clave_acceso: string;
  razon_social: string;
  fecha_emision: string;
  importe_total: number;
}

interface CompradoresResponse {
  cod_comprador: number;
  identificacion_comprador: string;
}

function ListaComprobantes() {
  const navigate = useNavigate();
  const [sortAscending, setSortAscending] = useState(true);
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    identificacion: "",
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

  // para manejar las fechas
  const [years, setYears] = useState<number[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [days, setDays] = useState<(number | "Todos")[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  const [selectedDay, setSelectedDay] = useState<number | "Todos">("Todos");

  useEffect(() => {
    // Generar años desde 2021 hasta el año actual
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let year = 2021; year <= currentYear; year++) {
      yearList.push(year);
    }
    setYears(yearList);
  }, []);

  useEffect(() => {
    // Actualizar meses disponibles según el año seleccionado
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Mes actual (enero = 1)

    const allMonths = [
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

    // Mostrar todos los meses para años anteriores, o hasta el mes actual para el año actual
    const availableMonths =
      selectedYear === currentYear
        ? allMonths.slice(0, currentMonth)
        : allMonths;

    setMonths(availableMonths);
    if (availableMonths.length < 12) setSelectedMonth(1); //? si el anio seleccionado tiene menos de 12 meses entonces select enero
  }, [selectedYear]);

  useEffect(() => {
    // Calcular días según el mes y el año seleccionados
    const calculateDays = (year: number, month: number) => {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const currentDay = new Date().getDate();

      // Días del mes seleccionado
      const daysInMonth = new Date(year, month, 0).getDate();

      // Si el año y mes seleccionados son el actual, limitar los días al día actual
      const maxDays =
        year === currentYear && month === currentMonth
          ? currentDay
          : daysInMonth;

      return ["Todos", ...Array.from({ length: maxDays }, (_, i) => i + 1)];
    };

    setDays(calculateDays(selectedYear, selectedMonth) as (number | "Todos")[]);
    setSelectedDay("Todos"); //?por cada cambio de mes o anio reinicia los dias
  }, [selectedYear, selectedMonth]);

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

  const token = localStorage.getItem("token");

  // para ordenar la tabla
  const handleSort = () => {
    const sortedData = [...comprobantes].sort((a, b) => {
      const dateA = new Date(a.fecha_emision);
      const dateB = new Date(b.fecha_emision);
      return sortAscending
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
    setSortAscending(!sortAscending);
    setComprobantes(sortedData);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviar los datos al backend usando fetch
      const response = await fetch(`${Config.apiBaseUrl}/lista_comprobantes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify({
          identificacion: formData.identificacion,
          anio: selectedYear.toString(),
          mes: selectedMonth.toString(),
          dia: selectedDay.toString(),
        }),
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const data = await response.json();
        Swal.fire(data.detail || "Error al enviar los datos");
      } else {
        const data = await response.json();
        console.log(data);
        setComprobantes(data);
      }
    } catch (err) {
      console.error("Error:", err);
      Swal.fire(`Hubo un error al procesar la solicitud`);
      window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetalle = (cod_comprobante: number) => {
    navigate(`/detalles_comprobante/${cod_comprobante}`);
  };
  return (
    <>
      <Navbar es_cliente={true} />

      {isSubmitting ? (
        <Cargador message="Consultando comprobantes, espere un momento..." />
      ) : null}

      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <p className=" text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            Lista de Comprobantes
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-5xl">
            <p className="text-gray-600 text-center mb-4">
              Ingrese los datos para la consulta:
            </p>

            {/* Formulario */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Input principal */}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                {/* Año */}
                <div>
                  <label htmlFor="year" className="block text-gray-600 mb-1">
                    Año
                  </label>
                  <select
                    id="year"
                    name="year"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    required
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mes */}
                <div>
                  <label htmlFor="month" className="block text-gray-600 mb-1">
                    Mes
                  </label>
                  <select
                    id="month"
                    name="month"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    required
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Día */}
                <div>
                  <label htmlFor="day" className="block text-gray-600 mb-1">
                    Día
                  </label>
                  <select
                    id="day"
                    name="day"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={selectedDay}
                    onChange={(e) =>
                      setSelectedDay(
                        e.target.value === "Todos"
                          ? "Todos"
                          : Number(e.target.value)
                      )
                    }
                    required
                  >
                    {days.map((day) =>
                      day === "Todos" ? (
                        <option key={day} value="Todos">
                          {day}
                        </option>
                      ) : (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      )
                    )}
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
            {/* Tabla */}
            <table className="w-full table-auto border-collapse border border-gray-200 my-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">
                    Clave de acceso
                  </th>
                  <th className="border px-4 py-2 text-left">Razón social</th>
                  <th className="border px-4 py-2 text-left">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={handleSort}
                    >
                      Fecha de Emisión
                      {sortAscending ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      )}
                    </div>
                  </th>
                  <th className="border px-4 py-2 text-left">Monto</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {comprobantes.message ? (
                  <tr>
                    <td colSpan={5}>{comprobantes.message}</td>
                  </tr>
                ) : (
                  comprobantes.map((comprobante) => (
                    <tr
                      key={comprobante.cod_comprobante}
                      className="hover:bg-gray-50"
                    >
                      <td className="border px-4 py-2">
                        <small>{comprobante.clave_acceso}</small>
                      </td>
                      <td className="border px-4 py-2">
                        <small>{comprobante.razon_social}</small>
                      </td>
                      <td className="border px-4 py-2">
                        {comprobante.fecha_emision}
                      </td>
                      <td className="border px-4 py-2">
                        {comprobante.importe_total.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        <a
                          onClick={() =>
                            handleDetalle(comprobante.cod_comprobante)
                          }
                          className="cursor-pointer "
                        >
                          <EyeIcon className="w-10 h-10 hover:scale-115" />
                        </a>
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

export default ListaComprobantes;
