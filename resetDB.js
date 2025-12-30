// resetDB.js
const mongoose = require("mongoose");
require("dotenv").config();

const productoSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  description: String
});

const Producto = mongoose.model("products", productoSchema);

// Lista de productos completa
const productos = [
  {
    name: "Remera Roja",
    category: "Remeras",
    price: 1500,
    stock: 20,
    description: "Remera de algodón color rojo, talle M",
    image: "remeraroja.png"
  },
  {
    name: "Remera Amarilla",
    category: "Remeras",
    price: 1500,
    stock: 20,
    description: "Remera de algodón color amarillo, talle M",
    image: "remeraamarilla.png"
  },
  {
    name: "Remera Verde",
    category: "Remeras",
    price: 1500,
    stock: 20,
    description: "Remera de algodón color verde, talle M",
    image: "remeraverde.png"
  },
  {
    name: "Remera Azul",
    category: "Remeras",
    price: 1500,
    stock: 20,
    description: "Remera de algodón color azul, talle M",
    image: "remeraazul.png"
  },
  {
    name: "Remera Marrón",
    category: "Remeras",
    price: 1500,
    stock: 20,
    description: "Remera de algodón color marrón, talle M",
    image: "remeramarron.png"
  },
  {
    name: "Remera Blanca",
    category: "Remeras",
    price: 1500,
    stock: 20,
    description: "Remera de algodón color blanco, talle M",
    image: "remerablanca.png"
  },
  {
    name: "Remera Negra",
    category: "Remeras",
    price: 1500,
    stock: 20,
    description: "Remera de algodón color negro, talle M",
    image: "remeranegra.png"
  },
  {
    name: "Remera Gris",
    category: "Remeras",
    price: 1500,
    stock: 20,
    description: "Remera de algodón color gris, talle M",
    image: "remeragris.png"
  },
  {
    name: "Remera Violeta",
    category: "Remeras",
    price: 1500,
    stock: 20,
    description: "Remera de algodón color violeta, talle M",
    image: "remeravioleta.png"
  },
  {
    name: "Remera Celeste",
    category: "Remeras",
    price: 1500,
    stock: 20,
    description: "Remera de algodón color celeste, talle M",
    image: "remeraceleste.png"
  },
  {
    name: "Pantalón Rojo",
    category: "Pantalones",
    price: 3500,
    stock: 15,
    description: "Pantalón color rojo, talle 32",
    image: "pantalonrojo.png"
  },
  {
    name: "Pantalón Amarillo",
    category: "Pantalones",
    price: 3500,
    stock: 15,
    description: "Pantalón color amarillo, talle 32",
    image: "pantalonamarillo.png"
  },
  {
    name: "Pantalón Verde",
    category: "Pantalones",
    price: 3500,
    stock: 15,
    description: "Pantalón color verde, talle 32",
    image: "pantalonverde.png"
  },
  {
    name: "Pantalón Azul",
    category: "Pantalones",
    price: 3500,
    stock: 15,
    description: "Pantalón color azul, talle 32",
    image: "pantalonazul.png"
  },
  {
    name: "Pantalón Marrón",
    category: "Pantalones",
    price: 3500,
    stock: 15,
    description: "Pantalón color marrón, talle 32",
    image: "pantalonmarron.png"
  },
  {
    name: "Pantalón Blanco",
    category: "Pantalones",
    price: 3500,
    stock: 15,
    description: "Pantalón color blanco, talle 32",
    image: "pantalonblanco.png"
  },
  {
    name: "Pantalón Negro",
    category: "Pantalones",
    price: 3500,
    stock: 15,
    description: "Pantalón color negro, talle 32",
    image: "pantalonnegro.png"
  },
  {
    name: "Pantalón Gris",
    category: "Pantalones",
    price: 3500,
    stock: 15,
    description: "Pantalón color gris, talle 32",
    image: "pantalongris.png"
  },
  {
    name: "Pantalón Violeta",
    category: "Pantalones",
    price: 3500,
    stock: 15,
    description: "Pantalón color violeta, talle 32",
    image: "pantalonvioleta.png"
  },
  {
    name: "Pantalón Celeste",
    category: "Pantalones",
    price: 3500,
    stock: 15,
    description: "Pantalón color celeste, talle 32",
    image: "pantalonceleste.png"
  }
];

// Conexión y ejecución
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✔ Conectado a MongoDB");
    await Producto.deleteMany({});
    console.log("🧹 Colección limpiada");
    await Producto.insertMany(productos);
    console.log("✅ Productos insertados");
    mongoose.disconnect();
  })
  .catch((err) => console.error("❌ Error:", err));