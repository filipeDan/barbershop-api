import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Coloque a URL do seu backend aqui
});

export default api;