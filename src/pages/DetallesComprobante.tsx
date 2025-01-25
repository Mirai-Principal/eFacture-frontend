import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Cargador from "../components/Cargador";
import Footer from "../components/Footer";
import BackgroundPage from "../components/BackgroundPage";
import ValidateSession from "../components/ValidateSession";
import Swal from "sweetalert2";
import Config from "../components/Config";
import { Toast } from "../components/Alerts";

interface DetallesResponse {
  cod_categoria: number;
  cod_comprobante: number;
  cod_detalle: number;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  precio_total_sin_impuesto: number;
  impuesto_valor: number;
  detalle_valor: number;
}

interface CategoriasResponse {
  cod_categoria: number;
  categoria: string;
  descripcion_categoria: string;
  cant_sueldos_basico: number;
  created_at: string;
}

interface Props {
  cod_comprobante: number;
  selectedYear: number;
}

function DetallesComprobante(props: Props) {
  const navigate = useNavigate();

  //para consultar los comporadrores
  const [detalles, setDetalles] = useState<DetallesResponse[]>([]); // Estado para los datos formateados
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorias, setCategorias] = useState<CategoriasResponse[]>([]);
  const [selectedcategoria, setSelectedCategoria] = useState<number>();
  const [selectedDetalle, setSetSelectedDetalle] = useState<number>();

  // const { cod_comprobante } = useParams<{ cod_comprobante: string }>();
  const { cod_comprobante, selectedYear } = props;

  // get categorias
  const token = localStorage.getItem("token");
  useEffect(() => {
    (async () => {
      setIsSubmitting(true);

      try {
        // Enviar los datos al backend usando fetch
        const response = await fetch(
          `${Config.apiBaseUrl}/categorias_por_anio_lista/${selectedYear}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token!,
            },
          }
        );

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          const data = await response.json();
          Swal.fire(data.detail || "Error al enviar los datos");
        } else {
          const data = await response.json();
          setCategorias(data);
        }
      } catch (err) {
        console.error("Error:", err);
        Swal.fire(`Hubo un error al procesar la solicitud`);
        // window.location.reload();
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, []);

  // para actualizar la categoria
  useEffect(() => {
    if (selectedcategoria) {
      (async () => {
        setIsSubmitting(true);

        try {
          // Enviar los datos al backend usando fetch
          const response = await fetch(`${Config.apiBaseUrl}/detalles_update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token!,
            },
            body: JSON.stringify({
              cod_detalle: selectedDetalle,
              cod_categoria: selectedcategoria,
            }),
          });

          // Verificar si la respuesta es exitosa
          if (!response.ok) {
            const data = await response.json();
            Swal.fire(data.detail || "Error al enviar los datos");
          } else {
            const data = await response.json();
            console.log(data);
            Toast({ title: "Categoría asignada" });
          }
        } catch (err) {
          console.error("Error:", err);
          Swal.fire(`Hubo un error al procesar la solicitud`);
          // window.location.reload();
        } finally {
          setIsSubmitting(false);
        }
      })();
    }
  }, [selectedcategoria, selectedDetalle]);

  // listar detalles
  const { error, loading, tipoUsuario } = ValidateSession({
    route: `detalles_comprobante/${cod_comprobante}`,
    method: "GET",
    setEstado: setDetalles,
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
      {isSubmitting ? <Cargador message="Espere un momento..." /> : null}

      <div className="mx-auto max-w-4xl text-center">
        <p className=" text-balance text-2xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          Asigna una categoría a los detalles del comprobante
        </p>
      </div>

      <div className="flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-5xl  max-h-80 overflow-y-scroll">
          {/* Tabla */}
          <table className="w-full table-auto border-collapse border border-gray-200 my-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Descripción</th>
                <th className="border px-4 py-2 text-left">Cantidad</th>
                <th className="border px-4 py-2 text-left">
                  Valor sin impuesto
                </th>
                <th className="border px-4 py-2 text-left">Valor Impuesto</th>
                <th className="border px-4 py-2 text-left">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {detalles.message ? (
                <tr>
                  <td colSpan={5}>{detalles.message}</td>
                </tr>
              ) : (
                detalles.map((detalle) => (
                  <tr key={detalle.cod_detalle} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">
                      <small>{detalle.descripcion}</small>
                    </td>
                    <td className="border px-4 py-2">
                      <small>{detalle.cantidad}</small>
                    </td>
                    <td className="border px-4 py-2">
                      {detalle.precio_total_sin_impuesto}
                    </td>
                    <td className="border px-4 py-2">
                      {detalle.impuesto_valor}
                    </td>
                    <td className="border px-4 py-2">
                      {detalle.detalle_valor}
                    </td>
                    <td className="py-2 px-4 border-b text-sm text-gray-800">
                      <div>
                        <select
                          id={`categoria-${detalle.cod_detalle}`}
                          name={`categoria-${detalle.cod_detalle}`}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={selectedcategoria}
                          defaultValue={detalle.cod_categoria}
                          onChange={(e) => {
                            setSelectedCategoria(Number(e.target.value));
                            setSetSelectedDetalle(detalle.cod_detalle);
                          }}
                          required
                        >
                          {categorias.map((categoria) => (
                            <option
                              key={categoria.cod_categoria}
                              value={categoria.cod_categoria}
                            >
                              {categoria.categoria}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default DetallesComprobante;
