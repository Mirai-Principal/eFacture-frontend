import React from "react";
import { useNavigate } from "react-router-dom";
import ValidateSession from "../components/ValidateSession";
import Cargador from "../components/Cargador";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundPage from "../components/BackgroundPage";
import Config from "../components/Config";

function ExtraerComprobantes() {
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

  if (tipoUsuario && tipoUsuario != "cliente") navigate("/");

  return (
    <>
      <Navbar es_admin={true} />
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            Extraer Comprobantes
          </p>
        </div>
        <div className="flex items-center justify-center">
          <iframe src={`${Config.apiBaseUrl}/portal_sri`}></iframe>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ExtraerComprobantes;
