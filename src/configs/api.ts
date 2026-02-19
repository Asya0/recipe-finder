export const API_CONFIG = {
  baseURL: import.meta.env.VITE_STRAPI_URL,
  token: import.meta.env.VITE_STRAPI_TOKEN,

  endpoints: {
    recipes: "/api/recipes",
    recipesWithPopulate: "/api/recipes?populate=*",
  },
};
