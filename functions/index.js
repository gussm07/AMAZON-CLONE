const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51JRTPkC0MAkLLFXJCnG1RqVPHPfBhmrcr3TUa8N1TmZ5QS5RjWrOnEaW5jY0fz5qcluPwy9Ccm2ifE2M7ou9PNxr00z1EeSlDH"
);

//API

//APP CONFIGURATION
const app = express();

//MIDDLEWARE
app.use(cors({ origin: true }));
app.use(express.json());

//API ROUTES
app.get("/", (request, response) => response.status(200).send("hello world"));

app.post("/payments/create", async (request, response) => {
  const total = request.query.total; //ACCEDEMOS AL API MANDADO POR EL TOTAL DE PAGO
  console.log("Payment Request Received, for this amount: ", total);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  });
  //OK - CREATED
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

//LISTEN COMMAND
exports.api = functions.https.onRequest(app);

//EXAMPLE ENDPOINT
// http://localhost:5001/fir-a1d65/us-central1/api
