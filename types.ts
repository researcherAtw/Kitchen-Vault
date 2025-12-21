
export interface Nutrition {
  carbs: string;
  protein: string;
  calories: string;
  fat: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  category: string;
  description: string;
  duration: string;
  calories: string;
  nutrition: Nutrition;
  ingredients: Ingredient[];
  steps: string[];
  tips: string;
  youtubeUrl?: string;
}
