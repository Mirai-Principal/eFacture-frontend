import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, ClipboardIcon } from "@heroicons/react/24/outline";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Cargador from "../../components/Cargador";
import ValidateSession from "../../components/ValidateSession";
import BackgroundPage from "../../components/BackgroundPage";

// Define la estructura de los datos que esperas
interface Membresia {
  cod_membresia: string;
  nombre_membresia: string;
  precio: number;
  estado: string;
  fecha_lanzamiento: string;
  vigencia_meses: number;
}

function ListaMembresias() {
  const navigate = useNavigate();

  const [membresias, setMembresias] = useState<Membresia[]>([]);

  const { error, loading, res, tipoUsuario } = ValidateSession({
    route: "lista_membresias",
    method: "GET",
    setEstado: setMembresias,
  });

  if (loading) {
    return <Cargador />; // Mostrar un indicador de carga mientras valida
  }

  if (error) {
    console.log(error);
  }
  if (tipoUsuario != "admin") navigate("/");

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <>
      <Navbar es_admin={true} />
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            Membresías
          </p>

          <div className="flex items-center justify-center gap-6 mt-8">
            <div
              style={{ width: "300px" }}
              onClick={() => handleNavigation("/nueva_membresia")}
              className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:shadow-md hover:scale-105 transition-transform duration-300 bg-blue-500 text-white`}
            >
              <ClipboardIcon className="w-10 h-10" />
              <span className="text-lg font-semibold">Nueva Membresía</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className=" gap-6 p-6 bg-white shadow-lg rounded-lg">
            <table className="min-w-full table-auto border-collapse  min-h-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Nombre Membresía
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Precio
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Estado
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Fecha de Lanzamiento
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                    Vigencia (Meses)
                  </th>
                  <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody id="lista_membresias">
                {res!.message ? (
                  <tr>
                    <td colSpan={5}>{res.message}</td>
                  </tr>
                ) : (
                  membresias.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {item.nombre_membresia}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        ${item.precio.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {item.estado}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {new Date(item.fecha_lanzamiento).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        {item.vigencia_meses}
                      </td>
                      <td className="py-2 px-4 border-b text-sm text-gray-800">
                        <a href={`/actualizar_membresia/${item.cod_membresia}`}>
                          <EyeIcon className="w-10 h-10" />
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

export default ListaMembresias;
