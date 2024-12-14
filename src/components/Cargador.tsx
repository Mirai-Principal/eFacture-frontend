import React from "react";

interface LoaderProps {
  message?: string; // Mensaje opcional para mostrar junto al spinner
}

const Cargador = ({ message = "Cargando..." }: LoaderProps) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.10" }}
    >
      <div className="text-center">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">{message}</p>
      </div>
    </div>
  );
};

export default Cargador;
