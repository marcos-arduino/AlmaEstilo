const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🧪 Probando API de login...\n');

    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@almendra.com',
        password: 'admin123'
      })
    });

    console.log('📡 Status:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('📦 Respuesta:');
    console.log(JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Login exitoso!');
      console.log('🔑 Token:', data.token?.substring(0, 20) + '...');
    } else {
      console.log('\n❌ Login falló');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Asegúrate de que el servidor esté corriendo:');
    console.log('   npm run dev');
  }
}

testAPI();
