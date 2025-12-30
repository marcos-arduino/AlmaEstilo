const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs/promises");
const fsSync = require("fs");
require("dotenv").config();
const { MercadoPagoConfig, Preference } = require("mercadopago");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Utilidad para persistir catálogo a archivo JSON
async function writeCatalog(products) {
  try {
    const catalogPath = path.resolve(__dirname, "catalog.json");
    const data = JSON.stringify(products, null, 2);
    await fs.writeFile(catalogPath, data, "utf-8");
  } catch (e) {
    console.error("Error al escribir catalog.json:", e?.message || e);
  }
}

// Leer catálogo desde archivo si existe
async function readCatalog() {
  try {
    const catalogPath = path.resolve(__dirname, "catalog.json");
    const data = await fs.readFile(catalogPath, "utf-8");
    return JSON.parse(data);
  } catch (_) {
    return null;
  }
}

// Esquema y modelo de Producto
const productoSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String // nombre archivo imagen, ej: "remeraroja.png"
});
const Producto = mongoose.models.Producto || mongoose.model("Producto", productoSchema, "products");

// Datos en memoria (fallback)
let memoryProducts = [
  { _id: "1", name: "Remera Amarilla", price: 15999, category: "Remeras", image: "remeraamarilla.png" },
  { _id: "2", name: "Remera Verde", price: 15999, category: "Remeras", image: "remeraverde.png" },
  { _id: "3", name: "Pantalón Azul", price: 24999, category: "Pantalones", image: "pantalonazul.png" },
  { _id: "4", name: "Pantalón Cargo", price: 29999, category: "Pantalones", image: "pantaloncargo.png" },
  { _id: "5", name: "Zapatilla Urban", price: 45999, category: "Calzado", image: "zapatilla1.png" },
  { _id: "6", name: "Bota Cuero", price: 79999, category: "Calzado", image: "bota1.png" }
];
let memorySeq = memoryProducts.length + 1;

// Mercado Pago config
if (!process.env.MP_ACCESS_TOKEN) {
  console.warn("⚠ MP_ACCESS_TOKEN no está definido. Las rutas de pago responderán 500.");
}
const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || "" });

// Servir archivos estáticos (imágenes) desde la carpeta 'public/img'
// Usar path.resolve para ruta absoluta
console.log('Ruta pública imágenes:', path.join(__dirname, 'public', 'img'));

app.use('/img', express.static(path.resolve(__dirname, 'public', 'img')));

// Conexión a MongoDB o modo en memoria si no hay MONGO_URL
let useMemoryStore = false;
const mongoUrl = process.env.MONGO_URL;
if (mongoUrl) {
  mongoose
    .connect(mongoUrl)
    .then(async () => {
      console.log("✔ Conectado a MongoDB");
      try {
        // Si la colección está vacía, intentar poblarla desde catalog.json
        const count = await Producto.estimatedDocumentCount();
        if (count === 0) {
          const fileCatalog = await readCatalog();
          if (Array.isArray(fileCatalog) && fileCatalog.length > 0) {
            try {
              await Producto.insertMany(fileCatalog.map((p) => ({
                name: p.name,
                price: p.price,
                category: p.category,
                image: p.image,
              })));
              console.log(`✔ Se importaron ${fileCatalog.length} productos desde catalog.json`);
            } catch (ie) {
              console.warn("No se pudo importar catalog.json a MongoDB:", ie?.message || ie);
            }
          }
        }
        const all = await Producto.find();
        await writeCatalog(all);
      } catch (e) {
        console.warn("No se pudo inicializar catalog.json desde MongoDB:", e?.message || e);
      }
    })
    .catch((err) => {
      console.error("Error al conectar con MongoDB:", err);
      console.warn("⚠ Iniciando en modo memoria para /api/productos");
      useMemoryStore = true;
      // Inicializar memoria desde catalog.json si existe
      (async () => {
        const fileCatalog = await readCatalog();
        if (Array.isArray(fileCatalog) && fileCatalog.length > 0) {
          memoryProducts = fileCatalog.map((p, idx) => ({
            _id: String(idx + 1),
            name: p.name,
            price: p.price,
            category: p.category,
            image: p.image,
          }));
          memorySeq = memoryProducts.length + 1;
        }
        // Escribir a archivo para normalizar formato
        writeCatalog(memoryProducts);
      })();
    });
} else {
  console.warn("⚠ MONGO_URL no definida. Usando modo memoria para /api/productos");
  useMemoryStore = true;
  // Inicializar memoria desde catalog.json si existe
  (async () => {
    const fileCatalog = await readCatalog();
    if (Array.isArray(fileCatalog) && fileCatalog.length > 0) {
      memoryProducts = fileCatalog.map((p, idx) => ({
        _id: String(idx + 1),
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image,
      }));
      memorySeq = memoryProducts.length + 1;
    }
    writeCatalog(memoryProducts);
  })();
}

// Obtener todos los productos
app.get("/api/productos", async (req, res) => {
  if (useMemoryStore) {
    return res.json(memoryProducts);
  }
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    console.error("/api/productos error:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Agregar producto
app.post("/api/productos", async (req, res) => {
  if (useMemoryStore) {
    const doc = { _id: String(memorySeq++), ...req.body };
    memoryProducts.push(doc);
    // Persistir a archivo
    writeCatalog(memoryProducts);
    return res.status(201).json(doc);
  }
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    // Escribir catálogo completo a archivo
    try {
      const all = await Producto.find();
      await writeCatalog(all);
    } catch (e) {
      console.warn("No se pudo actualizar catalog.json:", e?.message || e);
    }
    res.status(201).json(nuevoProducto);
  } catch (err) {
    console.error("POST /api/productos error:", err);
    res.status(400).json({ error: "Error al agregar producto" });
  }
});

// ==== Pagos: crear preferencia de Mercado Pago ====
app.post("/api/payments/create-preference", async (req, res) => {
  try {
    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: "MP_ACCESS_TOKEN no configurado" });
    }
    const { items = [], payerEmail } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items vacíos" });
    }

    const preference = {
      items: items.map((i) => ({
        title: i.name,
        quantity: Number(i.qty || 1),
        currency_id: "ARS",
        unit_price: Number(i.price || 0),
        picture_url: i.image ? (typeof i.image === 'string' ? i.image : undefined) : undefined,
      })),
      payer: payerEmail ? { email: payerEmail } : undefined,
      back_urls: {
        success: process.env.MP_SUCCESS_URL || "http://localhost:3000",
        pending: process.env.MP_PENDING_URL || "http://localhost:3000",
        failure: process.env.MP_FAILURE_URL || "http://localhost:3000",
      },
      binary_mode: true,
      statement_descriptor: "ALMENDRA",
      notification_url: process.env.MP_WEBHOOK_URL || undefined,
    };

    const pref = new Preference(mpClient);
    const mpResp = await pref.create({ body: preference });
    // Log básico para diagnóstico (no incluye credenciales)
    try {
      console.log("MP preference created:", {
        haveBody: !!mpResp?.body,
        keys: Object.keys(mpResp || {}),
        id: mpResp?.id || mpResp?.body?.id,
      });
    } catch (_) {}

    const id = mpResp?.id || mpResp?.body?.id;
    const init_point = mpResp?.init_point || mpResp?.body?.init_point;
    const sandbox_init_point = mpResp?.sandbox_init_point || mpResp?.body?.sandbox_init_point;
    const redirect_url = id ? `https://www.mercadopago.com/checkout/v1/redirect?pref_id=${id}` : undefined;

    return res.json({
      preferenceId: id,
      init_point,
      sandbox_init_point,
      redirect_url,
    });
  } catch (err) {
    console.error("/api/payments/create-preference error:", err?.message || err);
    if (err?.cause) {
      console.error("cause:", err.cause);
    }
    return res.status(500).json({ error: "No se pudo crear la preferencia" });
  }
});

// Webhook básico
app.post("/api/payments/webhook", async (req, res) => {
  try {
    // Puedes validar aquí con la API de MP según 'type' e 'id' recibidos
    // y actualizar el estado de tu orden.
    res.sendStatus(200);
  } catch (err) {
    console.error("/api/payments/webhook error:", err?.message || err);
    res.sendStatus(500);
  }
});

// Servir frontend (React) si existe build o si estamos en producción
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
    res.send("Backend conectado correctamente");
  });
}

app.listen(PORT, () => {
  console.log(`▶ Servidor escuchando en http://localhost:${PORT}`);
});

