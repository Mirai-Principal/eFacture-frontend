import { useNavigate } from "react-router-dom";
import BackgroundPage from "../../components/BackgroundPage";
import Cargador from "../../components/Cargador";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import ValidateSession from "../../components/ValidateSession";
import { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ComputerDesktopIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Config from "../../components/Config";
import Swal from "sweetalert2";

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

const options = [
  {
    name: "Generar Dataset y Entrenar",
    icon: ComputerDesktopIcon,
    bgColor: "bg-red-500",
    href: "#",
  },
];

function Configuracion() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  //?   ESTADOS
  const [configuracionRes, setConfiguracionRes] = useState<
    ConfiguracionLista[]
  >([]);
  const [cargarLista, setCargarLista] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => setIsOpen(!isOpen);

  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    cod_regla: 0,
    nombre: "",
    descripcion: "",
    campo: "",
    operador: "",
    valor: "",
  });
  const [sortAscending, setSortAscending] = useState(true);

  // para ordenar la tabla
  const handleSortDates = () => {
    const sortedData = [...configuracionRes].sort((a, b) => {
      const dateA = new Date(a.updated_at.slice(0, 10));
      const dateB = new Date(b.updated_at.slice(0, 10));
      return sortAscending
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });

    setSortAscending(!sortAscending);
    setConfiguracionRes(sortedData);
  };

  // para ordenar la tabla
  const handleSortString = () => {
    const sortedData = [...configuracionRes].sort((a, b) => {
      const nameA = a.campo.toLowerCase();
      const nameB = b.campo.toLowerCase();

      return sortAscending
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setSortAscending(!sortAscending);
    setConfiguracionRes(sortedData);
  };

  //? PETICIONES HTTP

  const toggleModalMostrar = async (cod_regla: number) => {
    setIsOpen(!isOpen);

    setIsSubmitting(true);

    try {
      // Enviar los datos al backend usando fetch
      const response = await fetch(
        `${Config.apiBaseUrl}/configuracion/${cod_regla}`,
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
        setFormData(data);
      } else {
        Swal.fire(data.detail || "Error al enviar los datos");
      }

      // Guardar token para futuras solicitudes
      const new_token = response.headers.get("Authorization");
      localStorage.removeItem("token");
      localStorage.setItem("token", new_token!);
    } catch (err) {
      console.error("Error:", err);
      Swal.fire(`Hubo un error al procesar la solicitud`);
      // window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviar los datos al backend usando fetch
      const response = await fetch(`${Config.apiBaseUrl}/configuracion`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify(formData),
      });

      // Verificar si la respuesta es exitosa
      const data = await response.json();

      if (response.ok) {
        Swal.fire(data.message);
        toggleModal();
        setCargarLista(true);
      } else {
        Swal.fire(data.detail || "Error al enviar los datos");
      }

      // Guardar token para futuras solicitudes
      const new_token = response.headers.get("Authorization");
      localStorage.removeItem("token");
      localStorage.setItem("token", new_token!);
    } catch (err) {
      console.error("Error:", err);
      Swal.fire(`Hubo un error al procesar la solicitud`);
      // window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setIsSubmitting(true);

    const consultar = async () => {
      try {
        const response = await fetch(
          `${Config.apiBaseUrl}/configuracion_lista`,
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
          setConfiguracionRes(data);
          setCargarLista(false);
        } else {
          Swal.fire(data.detail);
          console.error("Error:", data.detail);
        }
      } catch (error) {
        Swal.fire("Hubo un error: " + error);
        console.error("Error:", error);
      } finally {
        setIsSubmitting(false);
        setFormData({
          cod_regla: 0,
          nombre: "",
          descripcion: "",
          campo: "",
          operador: "",
          valor: "",
        });
      }
    };
    consultar();
  }, [cargarLista]);

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

  const handleGenerarDataSet = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${Config.apiBaseUrl}/generar_dataset`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire(data.message);
        // Guardar token para futuras solicitudes
        const new_token = response.headers.get("Authorization");
        localStorage.removeItem("token");
        localStorage.setItem("token", new_token!);
      } else {
        Swal.fire(data.detail);
        console.error("Error:", data.detail);
      }
    } catch (error) {
      Swal.fire("Hubo un error: " + error);
      console.error("Error:", error);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <>
      <Navbar es_admin={true} />
      {isSubmitting ? <Cargador message="Espere un momento..." /> : null}
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Configuración del sistema
          </h2>
        </div>

        <div className="mx-auto mt-5 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-5 sm:gap-y-0 lg:max-w-5xl sm:max-w-5xl lg:grid-cols-1">
          <div className="bg-white p-6 rounded-lg shadow-xl mx-1  ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white shadow-lg rounded-lg">
              <div className="my-auto">
                <p>
                  Click para generar el dataset de datos y realizar el
                  entramiento
                </p>
              </div>
              <div>
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={handleGenerarDataSet}
                    className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer hover:shadow-md hover:scale-105 transition-transform duration-300 ${option.bgColor} text-white`}
                  >
                    <option.icon className="w-10 h-10" />
                    <span className="text-lg font-semibold">{option.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse  min-h-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Nombre
                    </th>

                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Descripción
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={handleSortString}
                      >
                        Campo
                        {sortAscending ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        )}
                      </div>
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Operador
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Valor
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Modificado el
                      {/* <div
                        className="flex items-center cursor-pointer"
                        onClick={handleSortDates}
                      >
                        Modificado el
                        {sortAscending ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        )}
                      </div> */}
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
                    configuracionRes.map((config, index) => (
                      <tr key={index} className={"hover:bg-gray-100"}>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          <small>{config.nombre}</small>
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
                className="text-gray-500 hover:text-gray-700 hover:scale-125 focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <div className="overflow-y-auto max-h-96">
                <form onSubmit={handleSubmit} className="space-y-4 px-5 ">
                  {/* Nombre */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700">Nombre</label>
                      <input
                        type="text"
                        id="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Ingrese el nombre"
                      />
                    </div>

                    {/* Campo (Solo lectura) */}
                    <div>
                      <label className="block text-gray-700">Campo</label>
                      <input
                        type="text"
                        id="campo"
                        value={formData.campo}
                        readOnly
                        className="w-full px-3 py-2 border bg-gray-100 rounded-md text-gray-500"
                      />
                    </div>

                    {/* Operador */}
                    <div>
                      <label className="block text-gray-700">Operador</label>
                      <select
                        id="operador"
                        value={formData.operador}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      >
                        <option value="" disabled>
                          Seleccione un operador
                        </option>
                        <option value="==">==</option>
                        <option value=">">{">"}</option>
                        <option value=">=">{">="}</option>
                        <option value="<">{"<"}</option>
                        <option value="<=">{"<="}</option>
                      </select>
                    </div>

                    {/* Valor */}
                    <div>
                      <label className="block text-gray-700">Valor</label>
                      <input
                        type="text"
                        id="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Ingrese un valor"
                      />
                    </div>
                  </div>
                  {/* Descripción */}
                  <div>
                    <label className="block text-gray-700">Descripción</label>
                    <input
                      type="text"
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Ingrese la descripción"
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
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Configuracion;
