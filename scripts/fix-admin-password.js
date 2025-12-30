const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixAdminPassword() {
  try {
    console.log('🔐 Actualizando contraseña del admin...\n');

    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Buscar admin
    const admin = await usersCollection.findOne({ email: 'admin@almendra.com' });

    if (!admin) {
      console.log('❌ No se encontró el usuario admin@almendra.com');
      console.log('   Creando nuevo admin...\n');

      // Crear admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await usersCollection.insertOne({
        email: 'admin@almendra.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Admin creado exitosamente');
      console.log('   Email: admin@almendra.com');
      console.log('   Password: admin123');
    } else {
      console.log('👤 Admin encontrado:', admin.email);
      
      // Hashear nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      // Actualizar
      await usersCollection.updateOne(
        { email: 'admin@almendra.com' },
        {
          $set: {
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            updatedAt: new Date()
          }
        }
      );

      console.log('✅ Contraseña actualizada exitosamente');
      console.log('   Email: admin@almendra.com');
      console.log('   Password: admin123');
    }

    console.log('\n⚠️  IMPORTANTE: Cambia esta contraseña en producción!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

fixAdminPassword();
