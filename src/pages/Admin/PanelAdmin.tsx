import { useNavigate } from "react-router-dom";

import {
  UsersIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
  TagIcon,
  CalendarIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";

import ValidateSession from "../../components/ValidateSession";
import Cargador from "../../components/Cargador";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import BackgroundPage from "../../components/BackgroundPage";

const PanelAdmin = () => {
  const navigate = useNavigate();

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

  if (tipoUsuario && tipoUsuario != "admin") navigate("/");

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const options = [
    {
      name: "Gestionar Membresías",
      icon: ClipboardIcon,
      bgColor: "bg-blue-500",
      href: "/lista_membresias",
    },
    {
      name: "Gestionar Categorías",
      icon: TagIcon,
      bgColor: "bg-green-500",
      href: "/categorias",
    },
    {
      name: "Listar Clientes Registrados",
      icon: UsersIcon,
      bgColor: "bg-purple-500",
      href: "/lista_clientes",
    },
    {
      name: "Periodo Fiscal",
      icon: CalendarIcon,
      bgColor: "bg-cyan-500",
      href: "/periodo_fiscal",
    },
    {
      name: "Fracción básica desgravada",
      icon: CurrencyDollarIcon,
      bgColor: "bg-yellow-500",
      href: "/fraccion_basica_desgravada",
    },
    {
      name: "Generar Dataset y Entrenar",
      icon: ComputerDesktopIcon,
      bgColor: "bg-red-500",
      href: "/generar_entrenamiento",
    },
  ];
  return (
    <>
      <Navbar es_admin={true} />

      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            Panel del Administrador
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-white shadow-lg rounded-lg">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleNavigation(option.href)}
                className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer hover:shadow-md hover:scale-105 transition-transform duration-300 ${option.bgColor} text-white`}
              >
                <option.icon className="w-10 h-10" />
                <span className="text-lg font-semibold">{option.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PanelAdmin;
