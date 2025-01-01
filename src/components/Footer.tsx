import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-8 ">
      <p className="">
        &copy; {new Date().getFullYear()} eFacure - SMARTWARE. Todos los
        derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
