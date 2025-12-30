// src/services/paymentService.js
const { Preference } = require('mercadopago');
const Order = require('../models/Order');
const configureMercadoPago = require('../config/mercadoPago');

const paymentService = {
  // Crear preferencia de pago
  createPaymentPreference: async (items, payerEmail, orderId) => {
    try {
      const mpClient = configureMercadoPago();
      const preference = {
        items: items.map((item) => ({
          title: item.name,
          quantity: item.quantity || 1,
          unit_price: Number(item.price),
          currency_id: 'ARS',
          picture_url: item.image || undefined,
        })),
        payer: payerEmail ? { email: payerEmail } : undefined,
        back_urls: {
          success: process.env.MP_SUCCESS_URL || 'http://localhost:3000/payment/success',
          pending: process.env.MP_PENDING_URL || 'http://localhost:3000/payment/pending',
          failure: process.env.MP_FAILURE_URL || 'http://localhost:3000/payment/failure',
        },
        auto_return: 'approved',
        binary_mode: true,
        statement_descriptor: 'ALMA ESTILO',
        external_reference: orderId || undefined,
      };

      const response = await new Preference(mpClient).create({ body: preference });
      
      return {
        id: response.id,
        init_point: response.init_point || response.sandbox_init_point,
        orderId,
      };
    } catch (error) {
      console.error('Error al crear preferencia de pago:', error);
      throw new Error('No se pudo crear la preferencia de pago');
    }
  },

  // Procesar notificación de pago
  processPaymentNotification: async (paymentId) => {
    try {
      const mpClient = configureMercadoPago();
      // Aquí iría la lógica para verificar el estado del pago
      // y actualizar la orden correspondiente
      console.log(`Procesando notificación de pago: ${paymentId}`);
      return { status: 'success' };
    } catch (error) {
      console.error('Error al procesar notificación de pago:', error);
      throw error;
    }
  },

  // Crear orden de compra
  createOrder: async (userId, items, total, shippingInfo) => {
    try {
      const order = new Order({
        user: userId,
        items: items.map(item => ({
          product: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
        })),
        total,
        status: 'pending',
        shippingAddress: shippingInfo,
      });

      await order.save();
      return order;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw new Error('No se pudo crear la orden');
    }
  },

  // Actualizar estado de la orden
  updateOrderStatus: async (orderId, status, paymentDetails = {}) => {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          status,
          paymentDetails,
          updatedAt: Date.now(),
          ...(status === 'completed' && { paidAt: Date.now() }),
        },
        { new: true }
      ).populate('user', 'name email');

      if (!order) {
        throw new Error('Orden no encontrada');
      }

      // Aquí podrías agregar lógica para enviar correos de notificación
      // o actualizar inventario cuando el pago es exitoso

      return order;
    } catch (error) {
      console.error('Error al actualizar estado de orden:', error);
      throw error;
    }
  },
};

module.exports = paymentService;