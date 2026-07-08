
const BASE_URL = "http://localhost:8080"

async function apiFetch(path, options={}) {
  if(!BASE_URL){
    throw new Error("Ein Fehler in BASE_URL !");
  }
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("API error:", res.status, data);
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
}

export async function login({ email, passwort }) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, passwort }),
  });
}

export async function registerStudent(req) {
  return apiFetch("/api/auth/register/student", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function registerProfessor(req) {
  return apiFetch("/api/auth/register/professor", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function activate({ email, code }) {
  return apiFetch("/api/auth/activate", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function passwortVergessen({ email }) {
  return apiFetch("/api/auth/passwort-vergessen", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function passwortZuruecksetzen({ token, neuesPasswort }) {
  return apiFetch("/api/auth/passwort-zuruecksetzen", {
    method: "POST",
    body: JSON.stringify({ token, neuesPasswort }),
  });
}
export async function getStudentProfil() {
  return apiFetch("/api/student/me", {
    method: "GET",
  });
}

export async function updateStudentProfil(req) {
  return apiFetch("/api/student", {
    method: "PUT",
    body: JSON.stringify(req),
  });
}


export async function getProfessorProfil() {
  return apiFetch("/api/professor/profil", {
    method: "GET",
  });
}

export async function updateProfessorProfil(req) {
  return apiFetch("/api/professor/profil-update", {
    method: "PUT",
    body: JSON.stringify(req),
  });
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getStudienfortschritt() {
  const res = await fetch(`${BASE_URL}/api/studienfortschritt`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("Nicht autorisiert. Bitte erneut einloggen.");
  }
  if (!res.ok) {
    throw new Error(`Studienfortschritt konnte nicht geladen werden (Status ${res.status})`);
  }
  return res.json();
}