import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://front-school-strapi.ktsdev.ru",
  // headers: {
  //   'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_TOKEN}`,
  //   'Content-Type': 'application/json'
  // },
})

export default apiClient;


// headers: { ... } -- содержит дополнительную информацию о запросе
// Bearer -- тип авторизации. "Я предъявитель вот этого токена, разрешите мне войти"
// ${import.meta.env.VITE_STRAPI_TOKEN} --  переменная окружения. это способ Vite прочитать переменные из .env файла. Приставка VITE_ обязательна, чтобы Vite понял, что эту переменную можно использовать в браузере.
