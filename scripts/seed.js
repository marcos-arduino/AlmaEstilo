const mongoose = require('mongoose');
require('dotenv').config();

const { User, Product } = require('../models');

async function seed() {
  try {
    console.log('🌱 Iniciando seed de base de datos...\n');

    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    // Limpiar base de datos
    console.log('🗑️  Limpiando base de datos...');
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Base de datos limpia\n');

    // Crear productos de ejemplo
    console.log('📦 Creando productos...');
    const products = await Product.insertMany([
      {
        name: 'Remera Roja',
        description: 'Remera de algodón color rojo, talle M',
        price: 1500,
        stock: 20,
        image: 'remeraroja.png',
        sizes: ['S', 'M', 'L', 'XL'],
        isActive: true
      },
      {
        name: 'Remera Amarilla',
        description: 'Remera de algodón color amarillo, talle M',
        price: 1500,
        stock: 20,
        image: 'remeraamarilla.png',
        sizes: ['S', 'M', 'L', 'XL'],
        isActive: true
      },
      {
        name: 'Remera Verde',
        description: 'Remera de algodón color verde, talle M',
        price: 1500,
        stock: 15,
        image: 'remeraverde.png',
        sizes: ['S', 'M', 'L', 'XL'],
        isActive: true
      },
      {
        name: 'Pantalón Negro',
        description: 'Pantalón de vestir color negro, talle 42',
        price: 3500,
        stock: 10,
        image: 'pantalonnegro.png',
        sizes: ['38', '40', '42', '44'],
        isActive: true
      },
      {
        name: 'Zapatos Negros',
        description: 'Zapatos formales color negro, talle 42',
        price: 4500,
        stock: 5,
        image: 'zapatosnegros.png',
        sizes: ['39', '40', '41', '42'],
        isActive: true
      },
      {
        name: 'Bota Negra',
        description: 'Bota de cuero negra, alta calidad',
        price: 20000,
        stock: 10,
        image: 'bota1.png',
        sizes: ['38', '39', '40', '41', '42', '43'],
        colors: ['Negro'],
        isActive: true,
        isFeatured: true
      }
    ]);
    console.log(`✅ ${products.length} productos creados\n`);

    // Crear usuarios
    console.log('👤 Creando usuarios...');
    const users = await User.insertMany([
      {
        email: 'admin@almendra.com',
        password: 'admin123',
        name: 'Administrador',
        role: 'admin',
        phone: '+54 11 1234-5678',
        isActive: true
      },
      {
        email: 'usuario@example.com',
        password: 'user123',
        name: 'Usuario Demo',
        role: 'user',
        phone: '+54 11 8765-4321',
        address: {
          street: 'Av. Corrientes 1234',
          city: 'Buenos Aires',
          state: 'CABA',
          zipCode: '1043',
          country: 'Argentina'
        },
        isActive: true
      }
    ]);
    console.log(`✅ ${users.length} usuarios creados\n`);

    console.log('✅ ¡Seed completado exitosamente!\n');
    console.log('📊 Datos creados:');
    console.log(`   - Productos: ${products.length}`);
    console.log(`   - Usuarios: ${users.length}\n`);
    console.log('🔑 Credenciales de acceso:');
    console.log('   Admin:');
    console.log('     Email: admin@almendra.com');
    console.log('     Password: admin123');
    console.log('   Usuario:');
    console.log('     Email: usuario@example.com');
    console.log('     Password: user123\n');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

seed();
