import React, { useState } from "react";
import ValidateSession from "../components/ValidateSession";
import { useNavigate } from "react-router-dom";
import Cargador from "../components/Cargador";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundPage from "../components/BackgroundPage";

interface SuscripcionDatos {
  caracteristicas: string;
  cod_membresia: string;
  cod_usuario: string;
  descripcion_membresia: string;
  estado_membresia: string;
  fecha_compra: string;
  nombre_membresia: string;
  fecha_vencimiento: string;
  order_id_paypal: string;
  cant_comprobantes_permitidos: number;
  cant_comprobantes_carga: number;
}

function MiSuscripcion() {
  const navigate = useNavigate();

  const [suscripcion, setSuscripcion] = useState<SuscripcionDatos>();

  const { error, loading, res, tipoUsuario } = ValidateSession({
    route: "mi_suscripcion",
    method: "GET",
    setEstado: setSuscripcion,
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
      <Navbar es_cliente={true} />
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Mi suscripción
          </h2>
          <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            Detalles de tu Suscripción
          </p>
        </div>
        {res.message ? (
          <p>{res.message}</p>
        ) : (
          <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="border-t border-gray-200 mt-4 pt-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Nombre de la Membresía:
                </span>{" "}
                {suscripcion.nombre_membresia}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Descripción:
                </span>{" "}
                {suscripcion.descripcion_membresia}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Características:
                </span>
              </p>
              <ul className="list-disc list-inside ml-6 text-gray-600">
                {suscripcion.caracteristicas
                  .split("\n")
                  .map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Estado:</span>{" "}
                {suscripcion.estado_membresia}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Fecha de Compra:
                </span>{" "}
                {suscripcion.fecha_compra}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Válido hasta:
                </span>{" "}
                {suscripcion.fecha_vencimiento}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Comprobantes permitidos:
                </span>{" "}
                {suscripcion?.cant_comprobantes_permitidos} de{" "}
                {suscripcion?.cant_comprobantes_carga}
              </p>

              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  ID de la Orden PayPal:
                </span>{" "}
                {suscripcion.order_id_paypal}
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default MiSuscripcion;
