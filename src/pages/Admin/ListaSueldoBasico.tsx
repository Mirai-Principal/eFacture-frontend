import React, { useState } from "react";
import Cargador from "../../components/Cargador";
import ValidateSession from "../../components/ValidateSession";
import { useNavigate } from "react-router-dom";
import BackgroundPage from "../../components/BackgroundPage";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Config from "../../components/Config";
import Swal from "sweetalert2";
import { PencilIcon } from "@heroicons/react/24/solid";

interface SueldoBasicoResponse {
  valor_sueldo: number;
  periodo_fiscal: string;
  cod_sueldo: number;
  estado: string;
}
function ListaSueldoBasico() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    valor_sueldo: 0,
    periodo_fiscal: "",
    cod_sueldo: 0,
    estado: "disponible",
  });

  const [sueldoBasico, setSueldoBasico] = useState<SueldoBasicoResponse[]>([]);
  const [tituloForm, setTituloForm] = useState("Nueva Categoría");
  const [bloquearInputs, setBloquearInputs] = useState<boolean>(false);

  const handleEdit =
    (sueldoBasico: SueldoBasicoResponse) => async (e: React.MouseEvent) => {
      e.preventDefault();

      setFormData({
        cod_sueldo: sueldoBasico.cod_sueldo,
        estado: sueldoBasico.estado,
        valor_sueldo: sueldoBasico.valor_sueldo,
        periodo_fiscal: sueldoBasico.periodo_fiscal.slice(0, 7),
      });
      setTituloForm("Editar Categoría");
      setBloquearInputs(true);
    };
  // valida la sesion
  const { error, loading, tipoUsuario, res } = ValidateSession({
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
  console.log(sueldoBasico);

  const today = new Date();
  const yearMonth = today.toISOString().slice(0, 7); // Esto extrae "YYYY-MM"

  // Para obtener el siguiente año (sumando 1 año)
  const nextYearMonth = new Date(today.setFullYear(today.getFullYear() + 1))
    .toISOString()
    .slice(0, 7);

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
            estado: formData.estado,
            cod_sueldo: formData.cod_sueldo,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire(data.message);
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

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-2">
          {/* Columna 1: Formulario */}
          <div className="bg-white p-6 rounded-lg shadow-md mx-1">
            <h2 className="text-xl font-semibold mb-4">{tituloForm}</h2>

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
                  disabled={bloquearInputs}
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
                  disabled={bloquearInputs}
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
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Estado
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
                  sueldoBasico.map((fila, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {fila.valor_sueldo} USD
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {fila.periodo_fiscal}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {fila.estado}
                      </td>
                      <td>
                        <a href="#" onClick={handleEdit(fila)}>
                          <PencilIcon className="h-5 w-5 mr-2" />
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

export default ListaSueldoBasico;
