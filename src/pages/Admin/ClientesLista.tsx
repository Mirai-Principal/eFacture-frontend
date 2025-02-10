import { useState } from "react";
import BackgroundPage from "../../components/BackgroundPage";
import Cargador from "../../components/Cargador";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import ValidateSession from "../../components/ValidateSession";
import { useNavigate } from "react-router-dom";

interface ClientesLista {
  cod_usuario: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  created_at: string;
  estado_membresia: string;
  fecha_vencimiento: string;
  cant_comprobantes_permitidos: number;
}

function ClientesLista() {
  const navigate = useNavigate();

  //? ESTADOS
  const [clientes, setClientes] = useState<ClientesLista[]>([]);

  //? PETCIONES HTTP

  //valida la sesion
  const { error, loading, tipoUsuario, res } = ValidateSession({
    route: "clientes_lista",
    method: "GET",
    setEstado: setClientes,
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
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Lista de clientes registrados
          </h2>
        </div>

        <div className="mx-auto mt-5 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-5 sm:gap-y-0 lg:max-w-5xl sm:max-w-5xl lg:grid-cols-1">
          <div className="bg-white lg:p-6 sm:p-2 rounded-lg shadow-xl mx-1  ">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse  min-h-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      #
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Identificación
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Cliente
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Correo
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Fecha Registro
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Estado Suscripción
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Suscripción Hasta
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                      Cupo Disponible
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {res.message ? (
                    <tr>
                      <td colSpan={5}>{res.message}</td>
                    </tr>
                  ) : (
                    clientes.map((cliente, index) => (
                      <tr key={index} className={"hover:bg-gray-100"}>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          <small>{cliente.identificacion}</small>
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          <small>{cliente.nombres}</small>{" "}
                          <small>{cliente.apellidos}</small>
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {cliente.correo}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {cliente.created_at}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {cliente.estado_membresia}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {cliente.fecha_vencimiento}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {cliente.cant_comprobantes_permitidos} Comprobantes
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
      <Footer />
    </>
  );
}

export default ClientesLista;
