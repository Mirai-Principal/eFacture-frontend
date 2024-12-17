import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ValidateSession from "../../components/ValidateSession";
import Cargador from "../../components/Cargador";
import Footer from "../../components/Footer";
import Navbar from "../../components/navbar";

const PanelAdmin = () => {
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
      <Navbar es_admin={true} />
      <div className="container contenido">
        <div className=" mt-5 ">
          <h1 className="text-center mb-4">Panel de Administrador</h1>
          <div className="row d-flex justify-content-center">
            {/* Botón Extraer comprobantes */}
            <div className="col-12 col-md-6 col-lg-3 mb-3">
              <button
                className="btn btn-primary w-100 p-3"
                onClick={() => handleNavigation("/lista_membresias")}
              >
                Gestionar Membresías
              </button>
            </div>

            {/* Botón Realizar deducción */}
            <div className="col-12 col-md-6 col-lg-3 mb-3">
              <button
                className="btn btn-success w-100 p-3"
                onClick={() => handleNavigation("/categorias")}
              >
                Gestionar categorías
              </button>
            </div>
          </div>

          <div className="row d-flex justify-content-center">
            {/* Botón Ver historial de deducciones */}
            <div className="col-12 col-md-6 col-lg-3 mb-3">
              <button
                className="btn btn-warning w-100 p-3"
                onClick={() => handleNavigation("/lista_clientes")}
              >
                Listar clientes registrados
              </button>
            </div>

            {/* Botón Predicción de gastos */}
            <div className="col-12 col-md-6 col-lg-3 mb-3">
              <button
                className="btn btn-info w-100 p-3"
                onClick={() => handleNavigation("/sueldo_basico")}
              >
                Sueldo básico
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PanelAdmin;
