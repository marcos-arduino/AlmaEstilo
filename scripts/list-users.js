const mongoose = require('mongoose');
require('dotenv').config();

async function listUsers() {
  try {
    console.log('👥 Listando usuarios...\n');

    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const users = await usersCollection.find().toArray();

    console.log(`📊 Total de usuarios: ${users.length}\n`);

    if (users.length === 0) {
      console.log('⚠️  No hay usuarios registrados');
    } else {
      console.log('👤 Usuarios registrados:\n');
      
      users.forEach((user, index) => {
        const roleIcon = user.role === 'admin' ? '👑' : '👤';
        const statusIcon = user.isActive ? '✅' : '❌';
        
        console.log(`${index + 1}. ${roleIcon} ${user.email}`);
        console.log(`   Nombre: ${user.name || 'Sin nombre'}`);
        console.log(`   Role: ${user.role || 'user'}`);
        console.log(`   Activo: ${statusIcon}`);
        console.log(`   Creado: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

listUsers();
