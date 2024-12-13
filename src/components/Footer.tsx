import React from "react";

const Footer = () => {
  return (
    <footer className="footer text-center">
      <div className="row bg-secondary text-white ">
        <p className="my-3">
          &copy; {new Date().getFullYear()} eFacure - SMARTWARE. Todos los
          derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
