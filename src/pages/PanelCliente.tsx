import React from "react";
import { useNavigate } from "react-router-dom";

import ValidateSession from "../components/ValidateSession";
import Cargador from "../components/Cargador";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import Config from "../components/Config";

const PanelUsuario = () => {
  const navigate = useNavigate();

  const { error, loading } = ValidateSession({ esPanel: true });

  if (loading) {
    return <Cargador />; // Mostrar un indicador de carga mientras valida
  }

  if (error) {
    console.log(error);
  }

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <>
      <Navbar es_cliente={true} />
      <div className="container contenido">
        <div className=" mt-5 ">
          <h1 className="text-center mb-4">Panel de Usuario</h1>
          <div className="row d-flex justify-content-center">
            {/* Botón Extraer comprobantes */}
            <div className="col-12 col-md-6 col-lg-3 mb-3">
              <button
                className="btn btn-primary w-100 p-3"
                onClick={() => handleNavigation("/extraer-comprobantes")}
              >
                Extraer comprobantes
              </button>
            </div>

            {/* Botón Realizar deducción */}
            <div className="col-12 col-md-6 col-lg-3 mb-3">
              <button
                className="btn btn-success w-100 p-3"
                onClick={() => handleNavigation("/realizar-deduccion")}
              >
                Realizar deducción
              </button>
            </div>
          </div>

          <div className="row d-flex justify-content-center">
            {/* Botón Ver historial de deducciones */}
            <div className="col-12 col-md-6 col-lg-3 mb-3">
              <button
                className="btn btn-warning w-100 p-3"
                onClick={() => handleNavigation("/ver-historial-deducciones")}
              >
                Ver historial de deducciones
              </button>
            </div>

            {/* Botón Predicción de gastos */}
            <div className="col-12 col-md-6 col-lg-3 mb-3">
              <button
                className="btn btn-info w-100 p-3"
                onClick={() => handleNavigation("/prediccion-gastos")}
              >
                Predicción de gastos
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PanelUsuario;
