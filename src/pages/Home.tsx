import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ValidateSession from "../components/ValidateSession";
import Cargador from "../components/Cargador";

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
      <div className="container contenido text-center">
        <div className="row my-4">
          <div className="col-md-6">
            <img src="/logo.png" alt="" />
          </div>
          <div className="col-md-6 my-auto ">
            <button
              onClick={handleLogin}
              className="btn btn-info d-block w-50 my-2 mx-auto"
            >
              Ingresar
            </button>
            <button
              onClick={handleRegister}
              className="btn btn-warning d-block w-50 my-2 mx-auto"
            >
              Registrar
            </button>
          </div>
        </div>
        <hr />
        <div className="row">
          <h2>Nuestro servicio</h2>
        </div>
        <div className="row">
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
            ✔ Integración Automática: Conecta directamente con el portal del SRI
            para extraer comprobantes sin esfuerzo.
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
      <Footer />
    </>
  );
};

export default Home;
