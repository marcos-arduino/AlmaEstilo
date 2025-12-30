const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Buscar admin
    const admin = await usersCollection.findOne({ email: 'admin@almendra.com' });
    
    if (!admin) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log('👤 Usuario encontrado:');
    console.log('   Email:', admin.email);
    console.log('   Nombre:', admin.name);
    console.log('   Role:', admin.role);
    console.log('   isActive:', admin.isActive);
    console.log('   Password (hash):', admin.password.substring(0, 20) + '...');
    console.log('');

    // Probar contraseña
    const testPassword = 'admin123';
    console.log(`🔐 Probando contraseña: "${testPassword}"`);
    
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    
    if (isMatch) {
      console.log('✅ Contraseña correcta!');
    } else {
      console.log('❌ Contraseña incorrecta');
      console.log('');
      console.log('Intentando actualizar contraseña...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await usersCollection.updateOne(
        { email: 'admin@almendra.com' },
        { $set: { password: hashedPassword } }
      );
      
      console.log('✅ Contraseña actualizada');
    }

    console.log('');
    console.log('🧪 Probando con el modelo User de Mongoose...');
    
    const { User } = require('./models');
    const userModel = await User.findOne({ email: 'admin@almendra.com' });
    
    if (userModel) {
      console.log('✅ Usuario encontrado con modelo');
      const isMatchModel = await userModel.comparePassword('admin123');
      console.log('   Contraseña válida:', isMatchModel ? '✅' : '❌');
    } else {
      console.log('❌ Usuario NO encontrado con modelo');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testLogin();
