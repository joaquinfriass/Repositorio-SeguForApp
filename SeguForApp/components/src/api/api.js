// src/api/api.js
const API_URL = "http://192.168.100.49/segufor-api"; // <-- CAMBIAR IP por la tuya en LAN.

export async function login(email, password) {
  const res = await fetch(`${API_URL}/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  return await res.json();
}

export async function register(userData) {
  const res = await fetch(`${API_URL}/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  return await res.json();
}

export async function getUserData(id_usuario) {
  const res = await fetch(`${API_URL}/getUser.php?id=${id_usuario}`);
  return await res.json();
}

export async function updateUser(data) {
  const res = await fetch(`${API_URL}/update_perfil.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return await res.json();
}

export async function createReporte(data) {
  const res = await fetch(`${API_URL}/add_Reporte.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return await res.json();
}

export async function getReportes(id_usuario) {
  const res = await fetch(`${API_URL}/get_Reportes.php?id=${id_usuario}`);
  return await res.json();
}

export async function getNumeros() {
  const res = await fetch(`${API_URL}/get_numeros.php`);
  return await res.json();
}

// src/api/api.js

export async function deleteUser(id_usuario) {
  const res = await fetch(`${API_URL}/delete_perfil.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id_usuario }),
  });

  return await res.json();
}

export async function setNumero(data) {
  const res = await fetch(`${API_URL}/set_numero.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteNumero(id) {
  const res = await fetch(`${API_URL}/delete_numero.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return await res.json();
}



