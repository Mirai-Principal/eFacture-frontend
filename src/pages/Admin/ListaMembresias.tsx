import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar";
import Footer from "../../components/Footer";
import Cargador from "../../components/Cargador";
import ValidateSession from "../../components/ValidateSession";
import Config from "../../components/Config";

// Define la estructura de los datos que esperas
interface Membresia {
  cod_membresia: string;
  nombre_membresia: string;
  precio: number;
  estado: string;
  fecha_lanzamiento: string;
  vigencia_meses: number;
}

function ListaMembresias() {
  const navigate = useNavigate();

  const [membresias, setMembresias] = useState<Membresia[]>([]);
  useEffect(() => {
    // Llamada a la API para obtener las membresías
    const fetchMembresias = async () => {
      try {
        const response = await fetch(`${Config.apiBaseUrl}/lista_membresias`);
        const data = await response.json();
        setMembresias(data); // Guarda los datos en el estado
      } catch (error) {
        console.error("Error al obtener las membresías:", error);
      }
    };

    fetchMembresias();
  }, []); // Solo se ejecuta una vez al montar el componente

  const { error, loading } = ValidateSession({});
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
      <div className="container contenido text-center">
        <div className="row my-4">
          <div className="col-md-12 ">
            <h2>Membresías</h2>
            <input
              type="button"
              value="Nueva Membresía"
              className="btn btn-primary"
              onClick={() => handleNavigation("/nueva_membresia")}
            />
          </div>
          <div className="row my-4">
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-dark text-center">
                  <tr>
                    <th>Nombre Membresía</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Fecha de Lanzamiento</th>
                    <th>Vigencia (Meses)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody id="lista_membresias">
                  {membresias.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nombre_membresia}</td>
                      <td>${item.precio.toFixed(2)}</td>
                      <td>{item.estado}</td>
                      <td>
                        {new Date(item.fecha_lanzamiento).toLocaleDateString()}
                      </td>
                      <td>{item.vigencia_meses}</td>
                      <td>
                        <a href={`/actualizar_membresia/${item.cod_membresia}`}>
                          Ver
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ListaMembresias;
