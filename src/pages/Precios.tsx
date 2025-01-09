import { CheckIcon } from "@heroicons/react/20/solid";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ValidateSession from "../components/ValidateSession";
import Cargador from "../components/Cargador";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Config from "../components/Config";
import Swal from "sweetalert2";
import BackgroundPage from "../components/BackgroundPage";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface Membresia {
  cod_membresia: string;
  nombre_membresia: string;
  precio: number;
  estado: string;
  fecha_lanzamiento: string;
  descripcion_membresia: string;
  caracteristicas: string;
}
interface PagoPayPal {
  cod_membresia: string;
  precio: number;
  orderID: string;
}
export default function Precios() {
  const navigate = useNavigate();

  const [membresias, setMembresias] = useState<Membresia[]>([]);

  const initialOptions = {
    "client-id": Config.clientIDPayPal,
    currency: "USD",
    "data-page-type": "product-details",
    components: "buttons",
  };

  const [comprobante, setComprobante] = useState<PagoPayPal>();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (comprobante?.orderID) {
      const savePayment = async () => {
        try {
          const response = await fetch(
            `${Config.apiBaseUrl}/generar_suscripcion`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token!,
              },
              body: JSON.stringify(comprobante), // Envía el ID de la orden al backend
            }
          );

          const data = await response.json();

          if (response.ok) {
            Swal.fire("Se ha realizado el pago");
            navigate("/mi_suscripcion");
          } else {
            Swal.fire(data.detail);
            console.error("Error en la verificación:", data);
          }
        } catch (error) {
          Swal.fire("No se pudo verificar el pago");
          console.error("Error al verificar el pago:", error);
        }
      };

      savePayment();
    }
  }, [comprobante]); // Se ejecuta solo cuando cambia 'orderId'

  const { error, loading, res, tipoUsuario } = ValidateSession({
    route: "lista_memb_disponibles",
    method: "GET",
    setEstado: setMembresias,
  });

  if (loading) {
    return <Cargador />; // Mostrar un indicador de carga mientras valida
  }

  if (error) {
    console.log(error);
  }
  if (tipoUsuario != "cliente") navigate("/");

  console.log(membresias);

  return (
    <>
      <Navbar es_cliente={true} />
      <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-4 min-h-screen">
        <BackgroundPage />

        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Nuestros planes
          </h2>
          <p className="mt-2 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
            Elige el plan adecuado para ti
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {res.detail ? (
            <p> {res.detail}</p>
          ) : (
            membresias.map((tier, tierIdx) => (
              <div
                key={tier.cod_membresia}
                className={classNames(
                  tier.featured
                    ? "relative bg-gray-900 shadow-2xl"
                    : "bg-white/60 sm:mx-8 lg:mx-0",
                  "rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 m-1 border-double border-4"
                )}
              >
                <h3
                  id={tier.cod_membresia}
                  className={classNames(
                    tier.featured ? "text-indigo-400" : "text-indigo-600",
                    "text-base/7 font-semibold"
                  )}
                >
                  {tier.nombre_membresia}
                </h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span
                    className={classNames(
                      tier.featured ? "text-white" : "text-gray-900",
                      "text-5xl font-semibold tracking-tight"
                    )}
                  >
                    {tier.precio}
                  </span>
                  <span
                    className={classNames(
                      tier.featured ? "text-gray-400" : "text-gray-500",
                      "text-base"
                    )}
                  >
                    /anual
                  </span>
                </p>
                <p
                  className={classNames(
                    tier.featured ? "text-gray-300" : "text-gray-600",
                    "mt-6 text-base/7"
                  )}
                >
                  {tier.descripcion_membresia}
                </p>
                <ul
                  role="list"
                  className={classNames(
                    tier.featured ? "text-gray-300" : "text-gray-600",
                    "mt-8 space-y-3 text-sm/6 sm:mt-10"
                  )}
                >
                  {tier.caracteristicas.split("\n").map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        aria-hidden="true"
                        className={classNames(
                          tier.featured ? "text-indigo-400" : "text-indigo-600",
                          "h-6 w-5 flex-none"
                        )}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                {/* boton de pagos paypal */}
                <PayPalScriptProvider options={initialOptions}>
                  <PayPalButtons
                    style={{
                      shape: "rect",
                      layout: "vertical",
                      color: "gold",
                      label: "buynow",
                    }}
                    key={tier.cod_membresia}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: `${tier.precio}`, // Precio tota
                              breakdown: {
                                item_total: {
                                  currency_code: "USD",
                                  value: `${tier.precio}`, // Debe coincidir con la suma de los artículos
                                },
                              },
                            },
                            items: [
                              {
                                name: tier.nombre_membresia, // Item name
                                unit_amount: {
                                  currency_code: "USD",
                                  value: `${tier.precio}`, // Precio unitario
                                },
                                quantity: "1", // Cantidad
                                description: tier.descripcion_membresia, // Opcional: descripción
                                sku: tier.cod_membresia, // Item ID (usa 'sku' para que se reconozca como ID en el panel de PayPal)
                              },
                            ],
                          },
                        ],
                        intent: "CAPTURE",
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        // console.log("Pago aprobado:", details);

                        const { sku, unit_amount } =
                          details.purchase_units![0].items![0];

                        setComprobante({
                          cod_membresia: sku!,
                          precio: Number(unit_amount.value),
                          orderID: data.orderID,
                        });
                      });
                    }}
                    onCancel={(data) => {
                      console.log("Pago cancelado:", data);
                      Swal.fire("El pago no se ha completado");
                    }}
                    onError={(err) => {
                      console.error("Error al procesar el pago:", err);
                      Swal.fire("Error al procesar el pago");
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
