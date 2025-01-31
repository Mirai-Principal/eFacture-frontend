import { useNavigate } from "react-router-dom";
import BackgroundPage from "../../components/BackgroundPage";
import Cargador from "../../components/Cargador";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import ValidateSession from "../../components/ValidateSession";
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

interface ConfiguracionLista {
  cod_regla: number;
  nombre: string;
  descripcion: string;
  campo: string;
  operador: string;
  valor: string;
  created_at: string;
  updated_at: string;
}

function Configuracion() {
  const navigate = useNavigate();

  //?   ESTADOS
  const [condiguracionRes, setConfiguracionRes] = useState<
    ConfiguracionLista[]
  >([]);

  const [selectedConfig, setSelectedConfig] = useState<number>();

  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen(!isOpen);
  const toggleModalMostrar = (cod_regla: number) => {
    setIsOpen(!isOpen);
    setSelectedConfig(cod_regla);
  };

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    operador: "",
    valor: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Datos del formulario:", formData);
  };

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  //? PETCIONES HTTP

  //valida la sesion
  const { error, loading, tipoUsuario, res } = ValidateSession({
    route: "configuracion_lista",
    method: "GET",
    setEstado: setConfiguracionRes,
  });
  if (loading) {
    return <Cargador />; // Mostrar un indicador de carga mientras valida
  }
  if (error) {
    console.log(error);
  }
  if (tipoUsuario && tipoUsuario != "admin") navigate("/");

  console.log(condiguracionRes);

  return (
    <>
      <Navbar es_admin={true} />
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Configuración del sistema
          </h2>
        </div>
        <div className="mx-auto mt-5 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-5 sm:gap-y-0 lg:max-w-5xl sm:max-w-5xl lg:grid-cols-1">
          <div className="bg-white p-6 rounded-lg shadow-xl mx-1  ">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse  min-h-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      id
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Nombre
                    </th>

                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Descripción
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Campo
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Operador
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Valor
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Modificado el
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {res.message ? (
                    <tr>
                      <td colSpan={5}>{res.message}</td>
                    </tr>
                  ) : (
                    condiguracionRes.map((config, index) => (
                      <tr key={index} className={"hover:bg-gray-100"}>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          <small>{config.cod_regla}</small>
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          <small>{config.nombre.slice(0, 20) + "..."}</small>
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          <small>{config.descripcion}</small>
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {config.campo}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {config.operador}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {config.valor}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {config.created_at.slice(0, 10)}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          <a
                            onClick={() => toggleModalMostrar(config.cod_regla)}
                            className="cursor-pointer "
                          >
                            <PencilIcon className="h-5 w-5 mr-2 hover:scale-110" />
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
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl">
            {/* Header del modal */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-700">
                Actualizar configuración
              </h2>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <div className="overflow-y-auto max-h-96">
                <form onSubmit={handleSubmit} className="space-y-4 px-5">
                  {/* Nombre */}
                  <div>
                    <label className="block text-gray-700">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Ingrese el nombre"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-gray-700">Descripción</label>
                    <input
                      type="text"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Ingrese la descripción"
                    />
                  </div>

                  {/* Campo (Solo lectura) */}
                  <div>
                    <label className="block text-gray-700">Campo</label>
                    <input
                      type="text"
                      name="campo"
                      value="No modificable"
                      readOnly
                      className="w-full px-3 py-2 border bg-gray-100 rounded-md text-gray-500"
                    />
                  </div>

                  {/* Operador */}
                  <div>
                    <label className="block text-gray-700">Operador</label>
                    <select
                      name="operador"
                      value={formData.operador}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      <option value="">Seleccione un operador</option>
                      <option value="+">+</option>
                      <option value="-">-</option>
                      <option value="*">*</option>
                      <option value="/">/</option>
                    </select>
                  </div>

                  {/* Valor */}
                  <div>
                    <label className="block text-gray-700">Valor</label>
                    <input
                      type="text"
                      name="valor"
                      value={formData.valor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Ingrese un valor"
                    />
                  </div>

                  {/* Botón de envío */}
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Actualizar configuración
                  </button>
                </form>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-200">
              <button
                onClick={toggleModal}
                className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Configuracion;
