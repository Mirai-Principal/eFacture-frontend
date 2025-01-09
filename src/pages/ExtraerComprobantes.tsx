import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ValidateSession from "../components/ValidateSession";
import Cargador from "../components/Cargador";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundPage from "../components/BackgroundPage";
import Swal from "sweetalert2";
import Config from "../components/Config";

function ExtraerComprobantes() {
  const navigate = useNavigate();

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    identificacion: "",
    password: "",
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

  if (tipoUsuario && tipoUsuario != "cliente") navigate("/");

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log(formData);
      console.log(selectedYear);
      console.log(selectedMonth);
      console.log(selectedDay);
    } catch (err) {
      //   console.error("Error:", err);
      Swal.fire(`Hubo un error al procesar la solicitud`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar es_admin={true} />
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            Extraer Comprobantes
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
            <p className="text-gray-600 text-center mb-4">
              Ingrese los datos para la consulta:
            </p>

            {/* Formulario */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Input principal */}
              <div>
                <label htmlFor="identificacion" className="block text-gray-700">
                  Ruc/Cédula/Pasaporte
                </label>
                <input
                  type="text"
                  id="identificacion"
                  name="identificacion"
                  placeholder="Ingrese su Ruc/Cédula/Pasaporte"
                  value={formData.identificacion}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Ingrese la clave de su cuenta"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <hr />
              {/* Período de emisión */}
              <div className="grid grid-cols-3 gap-4">
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ExtraerComprobantes;
