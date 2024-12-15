import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registrar from "./pages/Registrar";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import CambiarPassword from "./pages/CambiarPassword";
import PanelCliente from "./pages/PanelCliente";
import PanelAdmin from "./pages/Admin/Paneladmin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/password_reset" element={<PasswordReset />} />
        <Route path="/cambiar_password" element={<CambiarPassword />} />
        <Route path="/panel_cliente" element={<PanelCliente />} />
        <Route path="/panel_admin" element={<PanelAdmin />} />
      </Routes>
    </Router>
  );
};

export default App;
