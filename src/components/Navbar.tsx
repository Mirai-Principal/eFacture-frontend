import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const handleLogout = () => {
  // Eliminar el token
  localStorage.removeItem("token");
};

const OpcionesCliente = [
  { name: "Inicio", href: "/panel_cliente", current: true },
  { name: "Precios", href: "/precios", current: false },
  { name: "Mi suscripción", href: "/mi_suscripcion", current: false },
  { name: "Perfil", href: "#", current: false },
  { name: "Salir", href: "/", current: false, onClick: handleLogout },
];

const OpcionesAdmin = [
  { name: "Inicio", href: "/panel_admin", current: true },
  { name: "Perfil", href: "#", current: false },
  { name: "Salir", href: "/", current: false, onClick: handleLogout },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  es_cliente?: boolean;
  es_admin?: boolean;
  tiene_suscripcion?: boolean;
}

function Navbar(props: Props) {
  const { es_cliente, es_admin, tiene_suscripcion } = props;
  let opciones = [];
  if (es_admin) opciones = OpcionesAdmin;
  else if (es_cliente) opciones = OpcionesCliente;

  return (
    <Disclosure as="nav" className="bg-gray-800 fixed z-10 min-w-full ">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            {opciones.length != 0 ? (
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block size-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden size-6 group-data-[open]:block"
                />
              </DisclosureButton>
            ) : null}
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <a href="/">
                <img
                  alt="Logo eFacture"
                  src="/logo_navbar.png"
                  className="h-8 w-auto"
                />
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {opciones.map((item) =>
                  tiene_suscripcion && item.name == "Mi suscripción " ? (
                    ""
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={item.onClick}
                      aria-current={item.current ? "page" : undefined}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {opciones.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              onClick={item.onClick}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}

export default Navbar;
