import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Registrar from "./pages/Registrar";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import CambiarPassword from "./pages/CambiarPassword";

import PanelCliente from "./pages/PanelCliente";

import PanelAdmin from "./pages/Admin/PanelAdmin";
import ListaMembresias from "./pages/Admin/ListaMembresias";
import NuevaMembresia from "./pages/Admin/NuevaMembresia";
import MembresiaModificar from "./pages/Admin/MembresiaModificar";
import Categorias from "./pages/Admin/Categorias";
import Precios from "./pages/Precios";
import MiSuscripcion from "./pages/MiSuscripcion";
import ExtraerComprobantes from "./pages/ExtraerComprobantes";
import ListaComprobantes from "./pages/ListaComprobantes";
import PeriodoFiscal from "./pages/Admin/PeriodoFiscal";
import FraccionBasica from "./pages/Admin/FraccionBasica";
import GenerarAgp from "./pages/GenerarAgp";
import PrediccionGastos from "./pages/PrediccionGastos";
import GenerarEntrenameiento from "./pages/Admin/GenerarEntrenameiento";

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
        <Route path="/precios" element={<Precios />} />
        <Route path="/mi_suscripcion" element={<MiSuscripcion />} />

        <Route path="/panel_admin" element={<PanelAdmin />} />
        <Route path="/lista_membresias" element={<ListaMembresias />} />
        <Route path="/nueva_membresia" element={<NuevaMembresia />} />
        <Route
          path="/actualizar_membresia/:cod_membresia"
          element={<MembresiaModificar />}
        />
        <Route path="/periodo_fiscal" element={<PeriodoFiscal />} />

        <Route
          path="/fraccion_basica_desgravada"
          element={<FraccionBasica />}
        />

        <Route path="/categorias" element={<Categorias />} />

        <Route path="/extraer_comprobantes" element={<ExtraerComprobantes />} />
        <Route path="/lista_comprobantes" element={<ListaComprobantes />} />

        <Route path="/generar_agp" element={<GenerarAgp />} />

        <Route path="/prediccion_gastos" element={<PrediccionGastos />} />

        <Route
          path="/generar_entrenamiento"
          element={<GenerarEntrenameiento />}
        />
      </Routes>
    </Router>
  );
};

export default App;
