interface Props {
  es_cliente?: boolean;
  es_admin?: boolean;
}

function Navbar(props: Props) {
  const { es_cliente, es_admin } = props;
  return (
    <nav className="navbar navbar-expand-lg bg-secondary  fixed-top ">
      <div className="container-fluid">
        <a className="navbar-brand text-white" href="/">
          <img
            src="/logo_navbar.png"
            alt="Logo eFacture"
            width="30"
            height="24"
          />
          Efacture
        </a>
        {es_cliente ? <OpcionesCliente /> : ""}
        {es_admin ? <OpcionesAdmin /> : ""}
      </div>
    </nav>
  );
}

export default Navbar;

const handleLogout = () => {
  // Eliminar el token
  localStorage.removeItem("token");
};
export function OpcionesCliente() {
  return (
    <>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a
              className="nav-link active"
              aria-current="page"
              href="/panel_cliente"
            >
              Inicio
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Precios
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Perfil
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/" onClick={handleLogout}>
              Salir
            </a>
          </li>
          {/* <li className="nav-item">
            <a className="nav-link disabled" aria-disabled="true">
              xdxd
            </a>
          </li> */}
        </ul>
      </div>
    </>
  );
}

export function OpcionesAdmin() {
  return (
    <>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a
              className="nav-link active"
              aria-current="page"
              href="/panel_admin"
            >
              Inicio
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Perfil
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/" onClick={handleLogout}>
              Salir
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
