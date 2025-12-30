const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://localhost:27017/ecommerce';

const productoSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
});

const Producto = mongoose.model('Producto', productoSchema, 'products'); // 'products' es el nombre de la colección

const productos = [
  { name: "Remera Roja", price: 1200, category: "Remeras", image: "/img/remeraroja.png" },
  { name: "Remera Amarilla", price: 1300, category: "Remeras", image: "/img/remeraamarilla.png" },
  { name: "Pantalón Azul", price: 1500, category: "Pantalones", image: "/img/pantalonazul.png" },
  { name: "Pantalón Negro", price: 1600, category: "Pantalones", image: "/img/pantalonnegro.png" },
  // agregá acá todos los productos que quieras
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Conectado a MongoDB');

    // Limpiar colección
    await Producto.deleteMany({});
    console.log('Colección products limpiada');

    // Insertar productos
    await Producto.insertMany(productos);
    console.log('Productos insertados correctamente');

    mongoose.disconnect();
  } catch (err) {
    console.error('Error en seed:', err);
  }
}

seed();
