import React, { useState, useEffect } from "react";
import "./Payment.css";
import { useStateValue } from "./StateProvider";
import CheckoutProduct from "./CheckoutProduct";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import { getBasketTotal } from "./reducer";
import axios from "./axios";
import { db } from "./firebase";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const history = useHistory();
  /* HOOKS */
  const stripe = useStripe();
  const elements = useElements();
  /* maneja el estado del boton cuando esta deshabilitado y cuando le das click */
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  /* permite el intercambio entre Stripe y el cliente en AMAZON */
  const [clientSecret, setClientSecret] = useState(true);

  /* CADA QUE EL BASKET TENGA CAMBIOS, GENERA UN NUEVO CLIENTSECRET */
  useEffect(() => {
    // generate the special stripe secret which allows us to charge a customer
    const getClientSecret = async () => {
      /* AXIOS PERMITE HACER GET, REQUEST, PUSH ETC... FETCHING LIBRARY*/
      const response = await axios({
        method: "post",
        // Stripe expects the total in a currencies subunits
        /* EL *100 DEPENDE DE LA CURRENCY QUE OCUPES, ESTE CASO ES DOLARES */
        /* ES UN REQUERIMIENTO DE STRIPE */
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });
      /* establece el clientsecret */
      setClientSecret(response.data.clientSecret);
    };

    getClientSecret();
  }, [basket]);

  const handleSubmit = async (event) => {
    // do all the fancy stripe stuff...
    event.preventDefault();
    setProcessing(true);
    /* SET PROCESSING SOLO PERMITE UNA VEZ DARLE CLICK A BUY NOW */

    const payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          /* busca el element card para hacer el pago */
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        // paymentIntent = payment confirmation

        //NO SQL DATA STRUCTURE
        db.collection("users")
          .doc(user?.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            basket: basket,
            amount: paymentIntent.amount,
            //time stamp de la hora de compra
            created: paymentIntent.created,
          });
        /* SI TODO SALE BIEN... */
        setSucceeded(true);
        setError(null);
        setProcessing(false);
        //DESPUES DE REALIZAR LA COMPRA, VACIA LA CESTA DE COMPRA
        dispatch({
          type: "EMPTY_BASKET",
        });
        /* LO REGRESAMOS A LAS ORDENES */
        history.replace("/orders");
      });
  };

  const handleChange = (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>

        {/* Payment section - delivery address */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>123 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>

        {/* Payment section - Review Items */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map(item => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        {/* Payment section - Payment method */}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            {/* Stripe magic will go */}
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              {/* PRECIO DE LAS COSAS */}
              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => <h3>Order Total: {value}</h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>

              {/* Errors */}
              {error && <div>{error}</div>}
            </form>
          </div>
          {/* Stripe magic will go */}
        </div>
      </div>
    </div>
  );
}

export default Payment;
