import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const sendAiMessage = (message) => {
  return axios.post(
    "http://localhost:8080/api/ai/chat",
    null,
    {
      params: { message },
      headers: {
        userId: "1",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
};

export default api;