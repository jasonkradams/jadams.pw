import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { getAllRecipes } from './recipes-index';

const recipes = getAllRecipes();

function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const hours = match[1] ? `${match[1]}h ` : '';
  const mins = match[2] ? `${match[2]}min` : '';
  return (hours + mins).trim() || iso;
}

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono flex flex-col">
      <Header />
      <main className="flex-1 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold mb-4 text-green-400">Recipes</h1>
          <p className="text-gray-400 mb-10">
            Personal recipes I&apos;ve found and loved over time.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    {recipe.prepTime && <span>Prep: {formatDuration(recipe.prepTime)}</span>}
                    {recipe.cookTime && <span>Cook: {formatDuration(recipe.cookTime)}</span>}
                    {recipe.difficulty && (
                      <span className="ml-auto text-green-400/70">{recipe.difficulty}</span>
                    )}
                  </div>
                  <CardTitle className="text-gray-100 group-hover:text-green-400 transition-colors">
                    {recipe.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed">{recipe.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(recipe.tags || []).map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="bg-gray-700 text-gray-300 hover:bg-green-500/20 hover:text-green-400"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/recipes/${recipe.slug}`} className="text-green-400 hover:text-green-300 hover:underline">
                    View recipe →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
