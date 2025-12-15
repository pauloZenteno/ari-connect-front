import ReactNativeBlobUtil from 'react-native-blob-util';
import md5 from 'js-md5';

// Headers que imitan a Safari
const COMPATIBILITY_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Connection': 'close' 
};

export async function digestFetch(url, options = {}) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.stringify(options.body) : null;

  // 👇 FORZAMOS HTTPS (Safari lo hace a veces automáticamente)
  // Si la url viene como http://192..., la cambiamos a https://192...
  const secureUrl = url.replace('http://', 'https://');

  console.log(`🚀 [NativeBlob] Conectando a: ${secureUrl}`);

  try {
    // 1. PRIMER INTENTO
    const firstRes = await ReactNativeBlobUtil
      .config({
        trusty: true, // Ignora certificados SSL inválidos (Vital para HTTPS local)
        timeout: 20000 
      })
      .fetch(method, secureUrl, { ...COMPATIBILITY_HEADERS, ...options.headers }, body);

    const status = firstRes.info().status;
    console.log(`📡 Status: ${status}`);

    if (status === 200) return parseResponse(firstRes.data);

    // 2. LOGICA DIGEST (Si responde 401)
    if (status === 401) {
      console.log("🔐 Autenticando...");
      const headers = firstRes.info().headers;
      const authHeader = headers['www-authenticate'] || headers['Www-Authenticate'];

      // ... (El resto de tu lógica de cálculo MD5 se mantiene igual) ...
      // Asegúrate de copiar tu bloque de cálculo MD5 aquí
      // ...
      
      // SOLO PARA QUE PUEDAS COPIAR RÁPIDO EL CALCULO SI LO NECESITAS:
      const params = {};
      authHeader.replace(/(\w+)=["']?([^'"\s,]+)["']?/g, (m, key, value) => params[key] = value);
      const username = 'admin'; 
      const password = 'admin123'; // ⚠️ REVISA TU CONTRASEÑA
      const ha1 = md5(`${username}:${params.realm}:${password}`);
      const ha2 = md5(`${method}:${secureUrl.replace(/^https?:\/\/[^\/]+/, '')}`);
      const nc = '00000001';
      const cnonce = md5(Date.now().toString()).substring(0, 16);
      let responseStr = md5(`${ha1}:${params.nonce}:${nc}:${cnonce}:${params.qop}:${ha2}`);
      const authResponseHeader = `Digest username="${username}", realm="${params.realm}", nonce="${params.nonce}", uri="${secureUrl.replace(/^https?:\/\/[^\/]+/, '')}", qop=${params.qop}, nc=${nc}, cnonce="${cnonce}", response="${responseStr}", opaque="${params.opaque}"`;

      // 3. SEGUNDO INTENTO CON AUTH
      const secondRes = await ReactNativeBlobUtil
        .config({ trusty: true, timeout: 20000 })
        .fetch(method, secureUrl, { 
          ...COMPATIBILITY_HEADERS, 
          ...options.headers, 
          'Authorization': authResponseHeader 
        }, body);
        
      console.log(`✅ Final: ${secondRes.info().status}`);
      return parseResponse(secondRes.data);
    }
    
    throw new Error(`Status desconocido: ${status}`);

  } catch (error) {
    console.error("🔥 Error:", error);
    throw error;
  }
}

function parseResponse(data) {
  try { return JSON.parse(data); } catch (e) { return data; }
}