import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const adminApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
