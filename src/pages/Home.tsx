import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/registrar");
  };

  return (
    <div className="container text-center">
      <Navbar />
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
          procesos relacionados con comprobantes electrónicos y la elbaboración
          de deducciones de impuestos. 🌟
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
          🚀 Transforma la forma en que manejas tus finanzas y dedícate a lo que
          realmente importa.
        </p>

        <p>💡 ¡Regístrate ahora y haz que la tecnología trabaje para ti!</p>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
