const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const fsSync = require("fs");
const multer = require("multer");
require("dotenv").config();
const { MercadoPagoConfig, Preference } = require("mercadopago");
const { protect, admin } = require('./src/middleware/auth');

// Importar rutas
const authRoutes = require('./src/routes/auth');
const productsRoutes = require('./src/routes/products');
// Las siguientes rutas pueden ser opcionales
let ordersRoutes, adminRoutes;

try {
  // Intentar cargar rutas opcionales
  ordersRoutes = require('./src/routes/orders');
  adminRoutes = require('./src/routes/adminRoutes');
  console.log('✅ Rutas adicionales cargadas correctamente');
} catch (err) {
  console.warn('⚠ Algunas rutas opcionales no están disponibles:', err.message);
}

// Rutas principales (siempre requeridas)
console.log('✅ Rutas principales cargadas correctamente');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Servir archivos estáticos (imágenes)
console.log('Ruta pública imágenes:', path.join(__dirname, 'public', 'img'));
app.use('/img', express.static(path.resolve(__dirname, 'public', 'img')));

// Conexión a MongoDB
const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  console.error("❌ MONGO_URL no está definida en .env");
  process.exit(1);
}

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    // Inicializar categorías por defecto si no existen
    Category.countDocuments()
      .then(async (count) => {
        if (count === 0) {
          await Category.insertMany([
            { name: 'Remeras', description: 'Remeras', isActive: true },
            { name: 'Pantalones', description: 'Pantalones', isActive: true },
            { name: 'Zapatos', description: 'Zapatos', isActive: true },
          ]);
          console.log('✅ Categorías por defecto creadas');
        }
      })
      .catch((err) => {
        console.warn('⚠ No se pudieron inicializar categorías:', err?.message || err);
      });
  })
  .catch((err) => {
    console.error("❌ Error al conectar con MongoDB:", err);
    process.exit(1);
  });

// Mercado Pago config
if (!process.env.MP_ACCESS_TOKEN) {
  console.warn("⚠ MP_ACCESS_TOKEN no está definido. Las rutas de pago responderán 500.");
}
const mpClient = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || "" 
});

// ============ RUTAS API ============

// Rutas de autenticación (si existen)
if (authRoutes) {
  app.use('/api/auth', authRoutes);
}
app.use('/api/products', productsRoutes);

// Rutas opcionales
if (ordersRoutes) app.use("/api/orders", ordersRoutes);
if (adminRoutes) app.use("/api/admin", adminRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Subida de imágenes (Multer)
const uploadDir = path.resolve(__dirname, 'public', 'img');
if (!fsSync.existsSync(uploadDir)) {
  fsSync.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `product-${unique}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new Error('Solo se permiten imágenes'));
  }
});

// Endpoint de subida de imagen
app.post('/api/upload', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió archivo' });
    }
    const imageUrl = `/img/${req.file.filename}`;
    return res.json({ imageUrl });
  } catch (err) {
    console.error('/api/upload error:', err);
    return res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

// Esquema de producto antiguo (compatible con estructura actual)
const ProductoSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  description: String
});

const ProductoLegacy = mongoose.models.Producto || mongoose.model('Producto', ProductoSchema, 'products');

// Ruta de productos legacy (compatibilidad con estructura antigua)
app.get("/api/productos", async (req, res) => {
  try {
    // Intentar primero con el modelo nuevo
    try {
      const { Product } = require('./models');
      const productos = await Product.find({ isActive: true })
        .populate('category', 'name slug');
      if (productos && productos.length > 0) {
        return res.json(productos);
      }
    } catch (err) {
      console.log('Modelo nuevo no disponible, usando legacy');
    }
    
    // Si no funciona, usar el modelo antiguo
    const productos = await ProductoLegacy.find();
    res.json(productos);
  } catch (err) {
    console.error("/api/productos error:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Ruta alternativa para productos
app.get("/api/products", async (req, res) => {
  try {
    // Intentar primero con el modelo nuevo
    try {
      const { Product } = require('./models');
      const productos = await Product.find({ isActive: true })
        .populate('category', 'name slug');
      if (productos && productos.length > 0) {
        return res.json({ products: productos });
      }
    } catch (err) {
      console.log('Modelo nuevo no disponible, usando legacy');
    }
    
    // Si no funciona, usar el modelo antiguo
    const productos = await ProductoLegacy.find();
    res.json({ products: productos });
  } catch (err) {
    console.error("/api/products error:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// ============ MERCADO PAGO ============

// Crear preferencia de pago
app.post("/api/payments/create-preference", async (req, res) => {
  try {
    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: "MP_ACCESS_TOKEN no configurado" });
    }
    
    const { items = [], payerEmail, orderId } = req.body || {};
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items vacíos" });
    }

    const preference = {
      items: items.map((i) => ({
        title: i.name || i.title,
        quantity: Number(i.qty || i.quantity || 1),
        currency_id: "ARS",
        unit_price: Number(i.price || 0),
        picture_url: i.image ? (typeof i.image === 'string' ? i.image : undefined) : undefined,
      })),
      payer: payerEmail ? { email: payerEmail } : undefined,
      back_urls: {
        success: process.env.MP_SUCCESS_URL || "http://localhost:3000/success",
        pending: process.env.MP_PENDING_URL || "http://localhost:3000/pending",
        failure: process.env.MP_FAILURE_URL || "http://localhost:3000/failure",
      },
      binary_mode: true,
      statement_descriptor: "ALMENDRA",
      notification_url: process.env.MP_WEBHOOK_URL || undefined,
      external_reference: orderId || undefined,
    };

    const pref = new Preference(mpClient);
    const mpResp = await pref.create({ body: preference });
    
    console.log("MP preference created:", {
      id: mpResp?.id || mpResp?.body?.id,
      orderId
    });

    const id = mpResp?.id || mpResp?.body?.id;
    const init_point = mpResp?.init_point || mpResp?.body?.init_point;
    const sandbox_init_point = mpResp?.sandbox_init_point || mpResp?.body?.sandbox_init_point;

    return res.json({
      preferenceId: id,
      init_point,
      sandbox_init_point,
    });
  } catch (err) {
    console.error("/api/payments/create-preference error:", err?.message || err);
    return res.status(500).json({ error: "No se pudo crear la preferencia" });
  }
});

// Webhook de Mercado Pago
app.post("/api/payments/webhook", async (req, res) => {
  try {
    const { type, data } = req.body;
    
    console.log('Webhook recibido:', { type, data });

    if (type === 'payment') {
      const { Order } = require('./models');
      const paymentId = data?.id;
      
      // Aquí puedes consultar el pago en la API de MP y actualizar la orden
      // const payment = await mercadopago.payment.get(paymentId);
      // await Order.findOneAndUpdate(
      //   { paymentId },
      //   { paymentStatus: payment.status }
      // );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("/api/payments/webhook error:", err?.message || err);
    res.sendStatus(500);
  }
});

// ============ FRONTEND ============

// Servir frontend (React) si existe build
const clientBuildPath = path.resolve(__dirname, "client", "build");
const hasBuild = fsSync.existsSync(path.join(clientBuildPath, "index.html"));

if (process.env.NODE_ENV === "production" || hasBuild) {
  app.use(express.static(clientBuildPath));

  // Catch-all para rutas no API: devuelve index.html
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) return res.status(404).end();
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ 
      message: "Backend Almendra API",
      version: "2.0",
      endpoints: {
        auth: "/api/auth",
        products: "/api/products",
        categories: "/api/categories",
        orders: "/api/orders"
      }
    });
  });
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`▶ Servidor escuchando en http://localhost:${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
