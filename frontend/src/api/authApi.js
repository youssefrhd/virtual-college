
const BASE_URL = "http://localhost:8080"/*process.env.REACT_APP_API_URL ?? ""*/;

async function apiFetch(path, body) {
  if(!BASE_URL){
    throw new Error("Ein Fehler in BASE_URL !");
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error("API error:", res.status, data);
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
}

export async function login({ email, passwort }) {
  return apiFetch("/api/auth/login", { email, passwort });
}

export async function registerStudent(req) {
  return apiFetch("/api/auth/register/student", req);
}

export async function registerProfessor(req) {
  return apiFetch("/api/auth/register/professor", req);
}

export async function activate({ email, code }) {
  return apiFetch("/api/auth/activate", { email, code });
}

export async function passwortVergessen({ email }) {
  return apiFetch("/api/auth/passwort-vergessen", { email });
}

export async function passwortZuruecksetzen({ token, neuesPasswort }) {
  return apiFetch("/api/auth/passwort-zuruecksetzen", { token, neuesPasswort });
}