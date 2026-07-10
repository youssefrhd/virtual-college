
const BASE_URL = "http://localhost:8080";

async function apiFetch(path, options = {}) {
  if (!BASE_URL) {
    throw new Error("Ein Fehler in BASE_URL!");
  }

  const token = localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body,
  });

  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get("content-type") || "";
  let data = {};

  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => ({}));
  } else {
    data = await res.text().catch(() => "");
  }

  if (!res.ok) {
    console.error("API error:", res.status, data);
    const msg =
      typeof data === "object"
        ? data?.message || data?.error || `HTTP ${res.status}`
        : data || `HTTP ${res.status}`;
    throw new Error(msg);
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

function getAuthHeaders(isJson = true) {
  const token = localStorage.getItem("token");
  return {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
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

export async function getAllKurse() {
  return apiFetch("/api/kurse", { method: "GET" });
}

export async function getKurs(kursId) {
  return apiFetch(`/api/kurse/${kursId}`, { method: "GET" });
}

export async function createKurs(req) {
  return apiFetch("/api/kurse/kurs-anlegen", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function deleteKurs(kursId) {
  return apiFetch(`/api/kurse/${kursId}`, { method: "DELETE" });
}

export async function getMaterialienByKurs(kursId) {
  return apiFetch(`/api/materialien/kurs/${kursId}`, { method: "GET" });
}

export async function createPdfMaterial({ titel, kursId, datei }) {
  const formData = new FormData();
  formData.append("titel", titel);
  formData.append("kursId", kursId);
  formData.append("datei", datei);

  return apiFetch("/api/materialien/pdf", {
    method: "POST",
    body: formData,
  });
}

export async function createLinkMaterial({ titel, url, kursId }) {
  const params = new URLSearchParams({ titel, url, kursId });
  return apiFetch(`/api/materialien/link?${params.toString()}`, {
    method: "POST",
  });
}

export async function downloadMaterial(materialId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api/materialien/${materialId}/download`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("Nicht autorisiert. Bitte erneut einloggen.");
  }

  if (!res.ok) {
    throw new Error(`Download fehlgeschlagen (Status ${res.status})`);
  }

  const blob = await res.blob();

  const disposition = res.headers.get("Content-Disposition") || "";
  let filename = "material.pdf";

  const match = disposition.match(/filename="(.+)"/);
  if (match && match[1]) {
    filename = match[1];
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function getMaterialById(materialId) {
  return apiFetch(`/api/materialien/${materialId}`, { method: "GET" });
}