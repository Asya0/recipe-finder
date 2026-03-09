import axios from "axios";
import qs from 'qs';

const apiClient = axios.create({
  baseURL: "https://front-school-strapi.ktsdev.ru",
  // headers: {
  //   'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_TOKEN}`,
  //   'Content-Type': 'application/json'
  // },
});

apiClient.interceptors.request.use((config) => {
  if (config.params) {
    config.paramsSerializer = (params) => {
      return qs.stringify(params, {
        encodeValuesOnly: true, 
        indices: false, 
        arrayFormat: 'repeat', 
      });
    };
  }
  return config;
});

export default apiClient;