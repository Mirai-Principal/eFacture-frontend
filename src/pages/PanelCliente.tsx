import { useNavigate } from "react-router-dom";

import {
  DocumentTextIcon,
  CalculatorIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

import ValidateSession from "../components/ValidateSession";
import Cargador from "../components/Cargador";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BackgroundPage from "../components/BackgroundPage";

const PanelCliente = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Extraer comprobantes",
      description: "Accede y descarga los comprobantes de manera eficiente.",
      icon: <DocumentTextIcon className="h-10 w-10 text-blue-600" />,
      href: "/extraer_comprobantes",
    },
    {
      title: "Lista de comprobantes",
      description: "Visualiza los comprobantes descargados y categorizalos.",
      icon: <ListBulletIcon className="h-10 w-10 text-emerald-600" />,
      href: "/lista_comprobantes",
    },
    {
      title: "Realizar deducción",
      description: "Gestiona las deducciones de forma rápida y segura.",
      icon: <CalculatorIcon className="h-10 w-10 text-green-600" />,
      href: "/realizar_deduccion",
    },
    {
      title: "Historial de deducciones",
      description: "Consulta y analiza las deducciones realizadas.",
      icon: <CurrencyDollarIcon className="h-10 w-10 text-yellow-500" />,
      href: "/historial_deducciones",
    },
    {
      title: "Predicción de gastos",
      description: "Obtén proyecciones basadas en tus datos.",
      icon: <ChartBarIcon className="h-10 w-10 text-purple-600" />,
      href: "/prediccion_gastos",
    },
  ];

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

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <>
      <Navbar es_cliente={true} />
      <div className="flex items-center justify-center isolate bg-white px-2 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
          <h1 className="text-2xl font-bold text-gray-700 text-center mb-6">
            Panel de Usuario
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleNavigation(option.href)}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition-shadow hover:bg-gray-100 hover:scale-105 hover:cursor-pointer"
              >
                <div className="mb-4">{option.icon}</div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {option.title}
                </h2>
                <p className="text-sm text-gray-600 text-center">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PanelCliente;
