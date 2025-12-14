import md5 from 'js-md5';

// ... (tu función parseDigestHeader sigue igual) ...
function parseDigestHeader(header) {
  // ... (mismo código de antes)
  const challenge = {};
  const re = /([a-z0-9_-]+)=(?:"([^"]+)"|([a-z0-9_-]+))/gi;
  let match;
  while ((match = re.exec(header))) {
    challenge[match[1]] = match[2] || match[3];
  }
  return challenge;
}

export async function digestFetch(url, options = {}) {
  const { username, password, method = 'GET', body = null } = options;

  console.log(`🚀 [Intento 1] Conectando a: ${url} (Timeout 5s)`);

  // 👇 AGREGAMOS TIMEOUT DE 5 SEGUNDOS
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const firstResponse = await fetch(url, {
      method,
      headers: options.headers,
      body: body ? JSON.stringify(body) : null,
      signal: controller.signal, // 👈 Vinculamos el timeout
    });
    clearTimeout(timeoutId); // Si responde, cancelamos el timeout

    console.log(`📡 [Respuesta 1] Status: ${firstResponse.status}`);

    if (firstResponse.status !== 401) {
      return firstResponse; 
    }

    // --- Lógica de Digest (Igual que antes) ---
    const authHeader = firstResponse.headers.get('www-authenticate');
    if (!authHeader) return firstResponse;

    const challenge = parseDigestHeader(authHeader);
    const realm = challenge.realm;
    const nonce = challenge.nonce;
    const qop = challenge.qop;
    const cnonce = Math.random().toString(36).substring(7);
    const nc = '00000001';
    const uri = url.replace(/^https?:\/\/[^\/]+/, '');

    const ha1 = md5(`${username}:${realm}:${password}`);
    const ha2 = md5(`${method}:${uri}`);
    const responseParams = [ha1, nonce, nc, cnonce, qop, ha2].join(':');
    const responseAuth = md5(responseParams);

    const authString = `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${uri}", qop=${qop}, nc=${nc}, cnonce="${cnonce}", response="${responseAuth}"`;

    console.log(`🔐 [Intento 2] Enviando credenciales...`);

    // Segundo fetch también con timeout
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 5000);

    const secondResponse = await fetch(url, {
      method,
      headers: {
        ...options.headers,
        'Authorization': authString,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : null,
      signal: controller2.signal,
    });
    clearTimeout(timeoutId2);

    console.log(`✅ [Respuesta 2] Status Final: ${secondResponse.status}`);
    return secondResponse;

  } catch (error) {
    // 👇 ESTO ES LO QUE QUEREMOS VER
    if (error.name === 'AbortError') {
      console.error("⏰ ERROR: Tiempo de espera agotado. El celular no ve la IP.");
    } else {
      console.error("🔥 ERROR RED:", error.message);
    }
    throw error;
  }
}