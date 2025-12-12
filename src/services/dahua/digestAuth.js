import md5 from 'js-md5';

// Esta función analiza el encabezado "WWW-Authenticate" que manda el Dahua
function parseDigestHeader(header) {
  const challenge = {};
  const re = /([a-z0-9_-]+)=(?:"([^"]+)"|([a-z0-9_-]+))/gi;
  let match;
  while ((match = re.exec(header))) {
    challenge[match[1]] = match[2] || match[3];
  }
  return challenge;
}

// Esta es la función maestra que usarás en lugar de 'fetch' normal
export async function digestFetch(url, options = {}) {
  const { username, password, method = 'GET', body = null } = options;

  // 1. Primer intento: Petición normal (seguramente fallará con 401)
  const firstResponse = await fetch(url, {
    method,
    headers: options.headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (firstResponse.status !== 401) {
    return firstResponse; // Si pasó a la primera (raro), retornamos
  }

  // 2. Si falló (401), capturamos el reto del encabezado
  const authHeader = firstResponse.headers.get('www-authenticate');
  if (!authHeader) return firstResponse;

  const challenge = parseDigestHeader(authHeader);
  const realm = challenge.realm;
  const nonce = challenge.nonce;
  const qop = challenge.qop;
  const cnonce = Math.random().toString(36).substring(7); // Aleatorio
  const nc = '00000001';
  const uri = url.replace(/^https?:\/\/[^\/]+/, ''); // Solo la ruta (/cgi-bin/...)

  // 3. Matemáticas de Digest Auth (HA1, HA2, Response)
  const ha1 = md5(`${username}:${realm}:${password}`);
  const ha2 = md5(`${method}:${uri}`);
  const responseParams = [ha1, nonce, nc, cnonce, qop, ha2].join(':');
  const responseAuth = md5(responseParams);

  const authString = `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${uri}", qop=${qop}, nc=${nc}, cnonce="${cnonce}", response="${responseAuth}"`;

  // 4. Segundo intento: Petición con la respuesta correcta
  return fetch(url, {
    method,
    headers: {
      ...options.headers,
      'Authorization': authString,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : null,
  });
}