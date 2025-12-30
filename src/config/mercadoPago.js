// src/config/mercadoPago.js
const { MercadoPagoConfig } = require('mercadopago');

const configureMercadoPago = () => {
  const mpAccessToken = process.env.MP_ACCESS_TOKEN;
  
  if (!mpAccessToken) {
    console.warn("⚠ MP_ACCESS_TOKEN no está definido. Las rutas de pago no funcionarán correctamente.");
  }

  const client = new MercadoPagoConfig({ 
    accessToken: mpAccessToken || "DUMMY_TOKEN",
  });

  return client;
};

module.exports = configureMercadoPago;