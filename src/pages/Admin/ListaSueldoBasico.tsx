import React, { useState } from "react";
import Cargador from "../../components/Cargador";
import ValidateSession from "../../components/ValidateSession";
import { useNavigate } from "react-router-dom";
import BackgroundPage from "../../components/BackgroundPage";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Config from "../../components/Config";
import Swal from "sweetalert2";

interface SueldoBasicoDatos {
  valor_sueldo: number;
  periodo_fiscal: string;
  cod_sueldo: string;
}
function ListaSueldoBasico() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    valor_sueldo: "",
    periodo_fiscal: "",
  });

  const [sueldoBasico, setSueldoBasico] = useState<SueldoBasicoDatos[]>([]);

  const { error, loading, tipoUsuario } = ValidateSession({
    route: "lista_sueldo_basico",
    method: "GET",
    setEstado: setSueldoBasico,
  });

  if (loading) {
    return <Cargador />; // Mostrar un indicador de carga mientras valida
  }

  if (error) {
    console.log(error);
  }

  if (tipoUsuario && tipoUsuario != "admin") navigate("/");

  const today = new Date();
  const yearMonth = today.toISOString().slice(0, 7); // Esto extrae "YYYY-MM"

  // Para obtener el siguiente año (sumando 1 año)
  const nextYearMonth = new Date(today.setFullYear(today.getFullYear() + 1))
    .toISOString()
    .slice(0, 7);

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const periodo_fiscal = formData.periodo_fiscal + "-01";

    try {
      const response = await fetch(
        `${Config.apiBaseUrl}/sueldo_basico_insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token!,
          },
          body: JSON.stringify({
            valor_sueldo: formData.valor_sueldo,
            periodo_fiscal,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire(data.message);
        setFormData({ periodo_fiscal: "", valor_sueldo: "" });
        // navigate("/sueldo_basico");
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

  return (
    <>
      <Navbar es_admin={true} />
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Historial de Sueldo Básico
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
          {/* Columna 1: Formulario */}
          <div className="bg-white p-6 rounded-lg shadow-md mx-1">
            <h2 className="text-xl font-semibold mb-4">
              Registrar Sueldo Básico
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="valor_sueldo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sueldo Básico
                </label>
                <input
                  type="number"
                  id="valor_sueldo"
                  value={formData.valor_sueldo}
                  min={1}
                  max={10000}
                  step={0.01}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="periodo_fiscal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Periodo Fiscal
                </label>
                <input
                  type="month"
                  id="periodo_fiscal"
                  value={formData.periodo_fiscal}
                  min={yearMonth}
                  max={nextYearMonth}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
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

          {/* Columna 2: Tabla de sueldos básicos */}
          <div className="bg-white p-6 rounded-lg shadow-md mx-1 min-h-full">
            <h2 className="text-xl font-semibold mb-4">
              Lista de Sueldos Básicos
            </h2>
            <table className="min-w-full table-auto border-collapse  min-h-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Sueldo Básico
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Periodo Fiscal
                  </th>
                </tr>
              </thead>
              <tbody>
                {sueldoBasico.map((fila, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">
                      {fila.valor_sueldo} USD
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">
                      {fila.periodo_fiscal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ListaSueldoBasico;
