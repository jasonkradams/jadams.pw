import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Recipes",
};
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecipeList from './RecipeList';
import { getAllRecipes } from './recipes-index';

export default function RecipesPage() {
  const recipes = getAllRecipes();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono flex flex-col">
      <Header />
      <main className="flex-1 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold mb-4 text-green-400">Recipes</h1>
          <p className="text-gray-400 mb-10">
            Personal recipes I&apos;ve found and loved over time.
          </p>
          <Suspense>
            <RecipeList recipes={recipes} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
