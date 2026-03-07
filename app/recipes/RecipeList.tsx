'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { buildTagUrl, formatDuration } from '@/lib/utils';
import type { RecipeMeta } from './recipes-index';

export default function RecipeList({ recipes }: { recipes: RecipeMeta[] }) {
  const searchParams = useSearchParams();
  const activeTags = searchParams.getAll('tag');

  const filtered = activeTags.length > 0
    ? recipes.filter(r => activeTags.every(t => r.tags?.includes(t)))
    : recipes;

  return (
    <div>
      {activeTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-gray-400 text-sm">Filtering by:</span>
          {activeTags.map(tag => (
            <Link key={tag} href={buildTagUrl('/recipes', activeTags, tag)}>
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/50 cursor-pointer hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-colors">
                {tag} ×
              </Badge>
            </Link>
          ))}
          <Link href="/recipes" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            clear all
          </Link>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-gray-400">No recipes match the selected tags.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((recipe) => (
          <Card key={recipe.slug} className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                {recipe.prepTime && <span>Prep: {formatDuration(recipe.prepTime)}</span>}
                {recipe.cookTime && <span>Cook: {formatDuration(recipe.cookTime)}</span>}
                {recipe.difficulty && (
                  <span className="ml-auto text-green-400/70">{recipe.difficulty}</span>
                )}
              </div>
              <CardTitle className="text-gray-100 group-hover:text-green-400 transition-colors">
                <Link href={`/recipes/${recipe.slug}`}>{recipe.title}</Link>
              </CardTitle>
              <CardDescription className="text-gray-400 leading-relaxed">{recipe.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {(recipe.tags || []).map((tag) => (
                  <Link key={tag} href={buildTagUrl('/recipes', activeTags, tag)}>
                    <Badge
                      variant="secondary"
                      className={`cursor-pointer transition-colors ${
                        activeTags.includes(tag)
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-gray-700 text-gray-300 hover:bg-green-500/20 hover:text-green-400'
                      }`}
                    >
                      {tag}
                    </Badge>
                  </Link>
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
  );
}
