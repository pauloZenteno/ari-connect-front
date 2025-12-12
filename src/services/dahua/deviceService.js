import { digestFetch } from './digestFetch';

const DEFAULT_USER = 'admin';

// --- Métodos Privados ---

async function sendRequest(ip, password, endpoint, method, data = null) {
  const url = `http://${ip}/cgi-bin/${endpoint}`;
  
  try {
    const response = await digestFetch(url, {
      method: method,
      username: DEFAULT_USER,
      password: password,
      body: data
    });

    const text = await response.text();
    
    // Dahua a veces responde con "OK" en texto plano o JSON
    if (response.ok) {
        return { success: true, data: text };
    } else {
        return { success: false, error: `Status ${response.status}: ${text}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// --- Métodos Públicos (Los que usará la App) ---

// 1. Probar Conexión
export async function checkConnection(ip, password) {
  return await sendRequest(ip, password, 'magicBox.cgi?action=getSystemInfo', 'GET');
}

// 2. Crear Usuario (Lógica 'Carlos')
export async function createUser(userData, ip, password) {
  console.log(`[Dahua] Creando usuario ${userData.name} en ${ip}...`);

  // Paso A: Crear Registro de Usuario
  const userPayload = {
    "UserList": [
      {
        "UserID": userData.id,
        "UserName": userData.name,
        "UserType": 0,
        "UserStatus": 0,
        "Authority": 2, // <--- Importante: 2 para ser visible
        "Password": "123456", // Contraseña por defecto para el empleado
        "Doors": [0],
        "TimeSections": [255], 
        "SpecialDaysSchedule": [255], 
        "ValidFrom": "2000-01-01 00:00:00",
        "ValidTo": "2037-12-31 23:59:59",
        "UseTime": 0,
        "IsFirstEnter": false
      }
    ]
  };

  const userResult = await sendRequest(ip, password, 'AccessUser.cgi?action=insertMulti', 'POST', userPayload);
  if (!userResult.success) return userResult;

  // Paso B: Crear Tarjeta Virtual (Mismo ID)
  const cardPayload = {
    "CardList": [{ 
        "UserID": userData.id, 
        "CardNo": userData.id, 
        "CardType": 0, 
        "CardName": userData.name, 
        "CardStatus": 0 
    }]
  };
  await sendRequest(ip, password, 'AccessCard.cgi?action=insertMulti', 'POST', cardPayload);

  // Paso C: Subir Foto (Si existe)
  if (userData.photo) {
    // Limpieza de base64 (Quitar "data:image/jpeg;base64,")
    let cleanPhoto = userData.photo;
    if (cleanPhoto.includes(",")) cleanPhoto = cleanPhoto.split(",")[1];
    cleanPhoto = cleanPhoto.replace(/(\r\n|\n|\r)/gm, "");

    const facePayload = {
      "FaceList": [{ 
          "UserID": userData.id, 
          "PhotoData": [cleanPhoto] 
      }]
    };
    await sendRequest(ip, password, 'AccessFace.cgi?action=insertMulti', 'POST', facePayload);
  }

  return { success: true, message: "Usuario sincronizado correctamente" };
}