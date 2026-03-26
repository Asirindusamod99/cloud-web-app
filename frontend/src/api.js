import axios from "axios";

// When running in Docker, Vite proxies /api → backend:8000
// When running locally outside Docker, point directly to Django.
const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

export const getNotes = () => api.get("/notes/");
export const createNote = (data) => api.post("/notes/", data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const updateNote = (id, data) => api.put(`/notes/${id}/`, data, {
  headers: { "Content-Type": "multipart/form-data" }
});
export const deleteNote = (id) => api.delete(`/notes/${id}/`);
