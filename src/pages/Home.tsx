import { useNavigate } from "react-router-dom";
import { ArrowRightIcon, UserPlusIcon } from "@heroicons/react/24/solid";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ValidateSession from "../components/ValidateSession";
import Cargador from "../components/Cargador";
import BackgroundPage from "../components/BackgroundPage";

const Home = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  //? si hay sesion redirige a donde corresponda
  if (token) {
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

    if (tipoUsuario == "cliente") navigate("/panel_cliente");
    else if (tipoUsuario == "admin") navigate("/panel_admin");
    else navigate("/");
  }

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/registrar");
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center isolate bg-white px-2 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
          {/* Contenedor principal */}
          <div className="flex flex-col md:flex-row items-center justify-center flex-grow gap-8 p-6">
            {/* Columna Izquierda: Imagen */}
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src="/logo.png" // Cambia por la URL de tu imagen
                alt="Imagen de la App"
                className="rounded-lg shadow-lg"
              />
            </div>

            {/* Columna Derecha: Botones */}
            <div className="w-full md:w-1/2 flex flex-col items-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                ¡Bienvenido a <span className="text-blue-500">eFacture</span>!
              </h1>
              <div className="flex flex-col gap-4 w-full max-w-sm">
                {/* Botón de Ingresar */}
                <button
                  onClick={handleLogin}
                  className="bg-blue-500 text-white py-3 rounded-lg shadow hover:bg-blue-600 transition flex items-center justify-center gap-2 cursor-pointer hover:shadow-md hover:scale-105 transition-transform duration-300"
                >
                  <ArrowRightIcon className="h-5 w-5" />
                  Ingresar
                </button>
                {/* Botón de Registrarse */}
                <button
                  onClick={handleRegister}
                  className="bg-gray-200 text-gray-800 py-3 rounded-lg shadow hover:bg-gray-300 transition flex items-center justify-center gap-2 cursor-pointer hover:shadow-md hover:scale-105 transition-transform duration-300"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  Registrarse
                </button>
              </div>
            </div>
          </div>
          {/* Texto descriptivo */}
          <div className="bg-gray-100 text-gray-800 py-6 text-center px-6">
            <h2>Nuestro servicio</h2>
            <h3>¡Simplifica tu gestión fiscal con nuestra aplicación!</h3>
            <p>
              Te ofrecemos un servicio diseñado para automatizar y optimizar tus
              procesos relacionados con comprobantes electrónicos y la
              elbaboración de deducciones de impuestos. 🌟
            </p>

            <p>¿Qué obtendrás con nosotros?</p>
            <p>✔ Organización: Clasifica tus comprobantes por categorías.</p>
            <p>
              ✔ Predicciones Personalizadas: Anticípate a tus gastos con
              proyecciones basadas en tus datos.
            </p>
            <p>
              ✔ Deducciones Simplificadas: Genera documentos de deducción de
              impuestos en segundos.
            </p>
            <p>
              ✔ Integración Automática: Conecta directamente con el portal del
              SRI para extraer comprobantes sin esfuerzo.
            </p>
            <p>
              ✔ Gestión Rápida: Actualiza, consulta y controla tus datos desde
              cualquier lugar.
            </p>
            <p>✔ Acceso Seguro: Tu información siempre protegida.</p>

            <p>
              🚀 Transforma la forma en que manejas tus finanzas y dedícate a lo
              que realmente importa.
            </p>

            <p>💡 ¡Regístrate ahora y haz que la tecnología trabaje para ti!</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
