import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const uploadPDF = (formData) => {
  return API.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const askQuestion = (data) => {
  return API.post("/ask", data);
};