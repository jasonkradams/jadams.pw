import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface StructuredIngredient {
  quantity: number;
  measurement: string;
  product: string;
  note?: string;
}

export interface NutritionRow {
  nutrient: string;
  amount: string;
}

export interface StructuredStep {
  title?: string;
  instruction: string;
}

export interface RecipeMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  description?: string;
  image?: string;
  tags?: string[];
  difficulty?: string;
  servings?: number;
  prepTime?: string;
  cookTime?: string;
  equipment?: string[];
  ingredients?: StructuredIngredient[];
  instructions?: StructuredStep[];
  tips?: string[];
  nutrition?: NutritionRow[];
}

export function getAllRecipes(): RecipeMeta[] {
  const recipesDir = path.join(process.cwd(), 'app/recipes');
  const files = fs.readdirSync(recipesDir).filter(f => f.endsWith('.mdx'));
  return files
    .map(file => {
      const slug = file.replace(/\.mdx$/, '');
      const source = fs.readFileSync(path.join(recipesDir, file), 'utf-8');
      const { data, content } = matter(source);
      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || content.slice(0, 180),
        date: data.date || '',
        description: data.description,
        image: data.image,
        tags: data.tags || [],
        difficulty: data.difficulty,
        servings: data.servings,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        equipment: data.equipment,
        ingredients: data.ingredients,
        instructions: data.instructions,
        tips: data.tips,
        nutrition: data.nutrition,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
