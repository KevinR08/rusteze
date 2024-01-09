// Navbar.jsx
import { useEffect, useState } from "react";
import "../styles/navbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../utils/authContext';
import { redirect } from "react-router-dom";
import LoginModal from "./loginModal";
import { infoToast } from "../utils/toast"





const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonValue, setButtonValue] = useState("Iniciar sesión");
  const { authData, setAuthorization } = useAuth();

  function handleSearch() {
    const searchInputValue = document.getElementById("navbar-search-input").value;
    window.location.href = `/search/cars?brand=${encodeURIComponent(searchInputValue)}`;
  }


  useEffect(() => {
    if (!authData) {
      setButtonValue("Iniciar sesión");
      return;
    }
    authData.isAuthorized ? setButtonValue("Cerrar sesión") : setButtonValue("Iniciar sesión");
  }, [authData]);

  const openModal = () => {
    if (!authData || !authData.isAuthorized) {
      setIsModalOpen(true);
      return;
    }
    setAuthorization({ isAuthorized: false, idToken: null, userID: null });
    setButtonValue("Iniciar sesión");
    infoToast("Cierre de sesión exitoso");
  };

  const handleRedirect = () => {
    window.location.href = "/register";
  };

  useEffect(() => {
    const searchInput = document.getElementById("navbar-search-input");
    searchInput.addEventListener("keydown", handleKeyDown);
    return () => {
      searchInput.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <nav id="navbar">
      <a href="/" className="logo"><img src="https://firebasestorage.googleapis.com/v0/b/carstore-69599.appspot.com/o/files%2FLogoRuzteze.png?alt=media&token=cc1a4d79-8e0e-410d-b5a0-52d223400521" alt=""></img></a>
      <ul>
        <li><a className="nav-link scrollto" href="/">Inicio</a></li>
        <li className="dropdown">
          <a className="nav-link" href="/search/cars?brand=">
            <span>Buscar por marca</span> <FontAwesomeIcon className="down_chevron" icon={faChevronDown} />
          </a>
          <ul>
            <li className="dropdown">
              <a href="/search/cars?brand=">
                <span>Marcas</span> <FontAwesomeIcon icon={faChevronRight} />
              </a>
              <ul>
                <li><a href="/search/cars?brand=Mazda">Mazda</a></li>
                <li><a href="/search/cars?brand=Kia">Kia</a></li>
                <li><a href="/search/cars?brand=Chevrolet">Chevrolet</a></li>
                <li><a href="/search/cars?brand=Hyundai">Hyundai</a></li>
                <li><a href="/search/cars?brand=Suzuki">Suzuki</a></li>
              </ul>
            </li>

          </ul>
        </li>
        {authData.isAuthorized && <li><a className="nav-link scrollto" href="/seller">Publicar</a></li>}
        
        {authData.isAuthorized && <li><a className="nav-link scrollto" href="/seller">Mis autos</a></li>}
        <li><a className="nav-link scrollto" href="/chat">Chat</a></li>
      </ul>
      <div className="search-bar">
        <FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass} />
        <input id="navbar-search-input" className="search-input" type="text"></input>
        <input onClick={handleSearch} className="search-button" type="submit" value="Buscar"></input>
      </div>



      <div className="button-container">
        <input onClick={openModal} className="btn-buy" type="button" value={buttonValue}></input>
        {!authData.isAuthorized && (
          <input onClick={handleRedirect} className="btn-buy" type="button" value="Registrarse"></input>
        )}
      </div>
      <LoginModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />

    </nav>
  );
}

export default Navbar;
