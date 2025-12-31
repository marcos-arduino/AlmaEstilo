const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Importar el modelo de usuario
const User = require('./src/models/User');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Función para crear el usuario administrador
async function createAdmin() {
  try {
    // Verificar si ya existe un administrador
    const adminExists = await User.findOne({ email: 'admin@almendra.com' });
    
    if (adminExists) {
      console.log('✅ El usuario administrador ya existe');
      process.exit(0);
    }

    // Crear el usuario administrador
    const admin = new User({
      name: 'Administrador',
      email: 'admin@almendra.com',
      password: 'admin123', // La contraseña se encriptará automáticamente
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('Email: admin@almendra.com');
    console.log('Contraseña: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear el usuario administrador:', error);
    process.exit(1);
  }
}

// Ejecutar la función
createAdmin();
