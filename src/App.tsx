import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registrar from "./pages/Registrar";
import Login from "./pages/Login";
import PanelCliente from "./pages/PanelCliente";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
        <Route path="/panel_cliente" element={<PanelCliente />} />
      </Routes>
    </Router>
  );
};

export default App;
