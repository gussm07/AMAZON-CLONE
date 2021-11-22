import React, { useEffect } from "react";
import react from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from "./checkout";
import Login from "./Login";
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import Payment from "./Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from "./Orders";

/* UTILIZA LLAVE PUBLICA DE LAS API KEYS DE STRIPE */
/* EN CASO DE PRODUCCION, DEBEMOS DE CAMBIAR LA CUENTA GRATUITA */
/* POR UNA DE PAGA QUE NOS LIBERE LAS LLAVES CORRESPONDIENTES EN STRIPE */
const promise = loadStripe(
  "pk_test_51JRTPkC0MAkLLFXJ0djbsTXbxuFFHFdhTNsTDgYmPAQjsf2luer8D6DbRZuG4APweQ8nZBYLRZpTd4h5Kx73wWMn001t4yhQmR"
);

function App() {
  const [{}, dispatch] = useStateValue();
  useEffect(() => {
    // will only run once when the app component loads...

    auth.onAuthStateChanged((authUser) => {
      console.log("THE USER IS >>> ", authUser);

      if (authUser) {
        // the user just logged in / the user was logged in
        /* SET_USER ES DECLARADO EN reducer.js */
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    <Router>
      <div className="app">
        {/* EL SWICH ES PARA CAMBIAR DE CASOS SEGUN CORRESPONDA*/}
        {/* EL DENTRO DEL ROUTE DEFINIMOS LAS RUTAS QUE QUEREMOS EN NAVEGADOR */}

        <Switch>
          <Route path="/orders">
            <Header />
            <Orders />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>
          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
