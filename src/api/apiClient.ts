import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://front-school-strapi.ktsdev.ru/api/recipes",
});

export default apiClient;
