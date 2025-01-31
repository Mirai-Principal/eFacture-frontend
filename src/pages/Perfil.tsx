import { useNavigate } from "react-router-dom";
import BackgroundPage from "../components/BackgroundPage";
import Cargador from "../components/Cargador";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ValidateSession from "../components/ValidateSession";
import { useState } from "react";
import GravatarImage from "../components/GravatarImage";
import Config from "../components/Config";
import Swal from "sweetalert2";
import { KeyIcon } from "@heroicons/react/24/outline";

interface Usuario {
  identificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  created_at: string;
}

function Perfil() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  //? ESTADOS

  const [formData, setFormData] = useState<Usuario>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // para el modal de detalles
  const [isOpen, setIsOpen] = useState(false);

  const toggleModalMostrar = (cod_comprobante: number) => {
    setIsOpen(!isOpen);
  };
  const toggleModal = () => setIsOpen(!isOpen);

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };
  //? PETCIONES HTTP

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviar los datos al backend usando fetch
      const response = await fetch(`${Config.apiBaseUrl}/usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Verificar si la respuesta es exitosa
      if (response.ok) {
        Swal.fire(data.message);
        console.log(data);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire(`${data.detail}`);
        console.log(data);
        // navigate("/login");
      }
    } catch (err) {
      //   console.error("Error:", err);
      Swal.fire(`${"Hubo un error al procesar la solicitud"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  //valida la sesion
  const { error, loading, tipoUsuario, res } = ValidateSession({
    route: "usuario",
    method: "GET",
    setEstado: setFormData,
  });
  if (loading) {
    return <Cargador />; // Mostrar un indicador de carga mientras valida
  }
  if (error) {
    console.log(error);
  }

  //   if (tipoUsuario && tipoUsuario != "admin") navigate("/");
  return (
    <>
      <Navbar
        es_admin={tipoUsuario === "admin"}
        es_cliente={tipoUsuario == "cliente"}
      />
      {isSubmitting ? <Cargador message="Espere un momento..." /> : null}

      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />

        <div className="mx-auto mt-5 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-5 sm:gap-y-0 lg:max-w-5xl sm:max-w-5xl lg:grid-cols-1">
          <div className="bg-white lg:p-6 sm:p-2 rounded-lg shadow-xl mx-1  ">
            <div className="overflow-x-auto">
              {" "}
              <div className="flex flex-col items-center space-y-4">
                <GravatarImage email={formData.correo} size={150} />
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg border">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-xl leading-6 font-medium text-gray-900">
                  Perfil del usuario
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <form
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  onSubmit={handleSubmit}
                  method="POST"
                >
                  <div>
                    <h2>Identificación:</h2>
                    <p> {formData.identificacion}</p>
                  </div>
                  <div>
                    <h2>Fecha Registro:</h2>
                    <p> {formData.created_at.slice(0, 10)}</p>
                  </div>
                  {/* Nombres */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="nombres"
                    >
                      Nombres
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      id="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Apellidos */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="apellidos"
                    >
                      Apellidos
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      id="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* correo */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="correo"
                    >
                      Correo
                    </label>
                    <input
                      type="text"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      id="correo"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </form>
                {/* contrasenia */}
                <br />
                <a
                  onClick={() => navigate("/cambiar_password")}
                  className="cursor-pointer  hover:scale-115"
                >
                  Cambiar contraseña
                  <KeyIcon className="w-10 h-10 inline-flex" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Perfil;
