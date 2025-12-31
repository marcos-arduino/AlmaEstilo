const mongoose = require('mongoose');
require('dotenv').config();

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    // Ver todas las colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Colecciones en la base de datos:');
    for (const col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`   - ${col.name}: ${count} documentos`);
    }
    console.log('');

    // Ver estructura de products
    const productsCollection = mongoose.connection.db.collection('products');
    const sampleProduct = await productsCollection.findOne();
    
    if (sampleProduct) {
      console.log('📦 Estructura de un producto:');
      console.log(JSON.stringify(sampleProduct, null, 2));
      console.log('');
    }

    // Ver si hay usuarios
    const usersCollection = mongoose.connection.db.collection('users');
    const userCount = await usersCollection.countDocuments();
    
    if (userCount > 0) {
      console.log('👥 Usuarios encontrados:');
      const users = await usersCollection.find().toArray();
      users.forEach(u => {
        console.log(`   - ${u.email} (${u.role || 'sin rol'})`);
      });
    } else {
      console.log('⚠️  No hay usuarios en la base de datos');
      console.log('   Necesitas ejecutar: npm run migrate');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkDB();
