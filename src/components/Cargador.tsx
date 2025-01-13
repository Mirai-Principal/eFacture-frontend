import React from "react";

interface LoaderProps {
  message?: string; // Mensaje opcional para mostrar junto al spinner
}

const Cargador = ({ message = "Cargando..." }: LoaderProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin text-white">
        <b>.</b>
      </div>
      <p className="text-white">{message}</p>
    </div>
  );
};

export default Cargador;
