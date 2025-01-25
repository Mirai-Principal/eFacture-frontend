import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import BackgroundPage from "../../components/BackgroundPage";
import { useNavigate } from "react-router-dom";
import Cargador from "../../components/Cargador";
import { useEffect } from "react";
import ValidateSession from "../../components/ValidateSession";
import { ComputerDesktopIcon } from "@heroicons/react/24/solid";
import Config from "../../components/Config";
import { Toast } from "../../components/Alerts";
import Swal from "sweetalert2";

const options = [
  {
    name: "Generar Dataset y Entrenar",
    icon: ComputerDesktopIcon,
    bgColor: "bg-red-500",
    href: "#",
  },
];

const token = localStorage.getItem("token");

function GenerarEntrenameiento() {
  const navigate = useNavigate();

  //? ESTADOS

  //? FUNCIONES HTTP

  const handleGenerarDataSet = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("hola");

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
        Toast({ title: data.message });
        console.log(data);
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
    }
  };

  //valida la sesion
  const { error, loading, tipoUsuario, res } = ValidateSession({
    route: "validate_token",
    method: "POST",
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
            Generar DataSet y Realizar Entrenamiento
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white shadow-lg rounded-lg">
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
      <Footer />
    </>
  );
}

export default GenerarEntrenameiento;
