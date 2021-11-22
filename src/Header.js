import React from "react";
import "./Header.css";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { auth } from "./firebase";

function Header() {
  /* variable para acceder al estado de los componentes de la app */
  /* variable basket contiene informacion al instante al precionar el buton */
  const [{ basket, user }, dispatch] = useStateValue();

  /* SI HAY UNA SESION INICIADA, PUEDES DARLE A LA OPCION SIGN OUT PARA CERRAR SESION */
  /* ESTO PUEDE MOSTRAR EL HOME SIN NECESIDAD DE LOGEARSE, PERO APARECE EN HEADER EL SIGN IN */

  const handleAuthentication = () => {
    if (user) {
      auth.signOut();
    }
  };

  return (
    <div className="header">
      {/* al dar click al logo dirige al menu principal */}
      <Link to="/">
        <img
          className="header__logo"
          src="http://pngimg.com/uploads/amazon/amazon_PNG11.png"
        />
      </Link>
      <div className="header__search">
        <input className="header__searchInput" type="text" />
        {/* logo */}
        <SearchIcon className="header__searchIcon" />
      </div>

      <div className="header__nav">
        {/* SOLO DIRIGE AL LOGIN PAGE SI NO HAY USUARIO */}
        <Link to={!user && "/login"}>
          <div onClick={handleAuthentication} className="header__option">
            {/* si no hay usuario, pon "Guest" y si si, elige el email */}
            <span className="header__optionLineOne">
              Hello {!user ? "Guest" : user.email}
            </span>
            <span className="header__optionLineTwo">
              {/* LINE PARA SABER SI YA INICIASTE SESION, CAMBIAR POR SIGN OUT O VICEVERSA */}
              {user ? "Sign Out" : "Sign In"}
            </span>
          </div>
        </Link>

        <Link to="orders">
          <div className="header__option">
            <span className="header__optionLineOne">Returns</span>
            <span className="header__optionLineTwo"> Orders</span>
          </div>
        </Link>

        <div className="header__option">
          <span className="header__optionLineOne">Your</span>
          <span className="header__optionLineTwo ">Prime</span>
        </div>

        <Link to="/checkout">
          <div className="header__optionBasket">
            <ShoppingBasketIcon />
            <span className="header__optionLineTwo header__basketCount">
              {/* actualiza los items cada vez que presionas ADD TO BASKET */}
              {/* MUESTRA EN LA GUI */}
              {basket.length}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
