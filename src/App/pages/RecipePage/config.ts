import type { Recipe } from '@/api/recipes';

export type RecipeInfoItem = {
    id: string;
    label: string;
    getValue: (recipe: Recipe) => string | number;
  };
  
  export const RECIPE_INFO_CONFIG: RecipeInfoItem[] = [
    { id: 'preparation', label: 'Preparation', getValue: (r) => `${r.preparationTime} minutes` },
    { id: 'cooking', label: 'Cooking', getValue: (r) => `${r.cookingTime} minutes` },
    { id: 'total', label: 'Total', getValue: (r) => `${r.totalTime} minutes` },
    { id: 'likes', label: 'Likes', getValue: (r) => r.likes },
    { id: 'servings', label: 'Servings', getValue: (r) => `${r.servings} servings` },
    { id: 'rating', label: 'Rating', getValue: (r) => `${r.rating} / 5` },
  ];