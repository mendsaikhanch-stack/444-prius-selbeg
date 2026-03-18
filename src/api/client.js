const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}

// Auth
export const login = (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const register = (name, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
export const getMe = () => request('/auth/me');

// Settings
export const fetchSettings = () => request('/settings');
export const saveSettings = (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) });
