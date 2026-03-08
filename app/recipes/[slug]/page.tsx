import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import remarkGfm from 'remark-gfm';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import RecipeViewer from '@/app/components/RecipeViewer';
import { getAllRecipes, type StructuredIngredient } from '../recipes-index';
import { mdxComponents } from '@/app/components/mdx-components';
import { Badge } from '@/components/ui/badge';
import { formatDuration } from '@/lib/utils';

export async function generateStaticParams() {
  return getAllRecipes().map(recipe => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getAllRecipes().find(r => r.slug === slug);
  return { title: recipe?.title ?? slug };
}

/** Convert a recipe title to a Go-idiomatic PascalCase var name */
function toGoVarName(title: string): string {
  return title
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');
}


function goIngredientSlice(ingredients: StructuredIngredient[]): string {
  if (ingredients.length === 0) return '[]Ingredient{}';
  const inner = ingredients.map(ing => {
    const qty = Number.isInteger(ing.quantity) ? `${ing.quantity}` : `${ing.quantity}`;
    const note = ing.note ? `, Note: "${ing.note.replace(/"/g, '\\"')}"` : '';
    const meas = ing.measurement ? `"${ing.measurement.replace(/"/g, '\\"')}"` : '""';
    return `\t\t{Quantity: ${qty}, Measurement: ${meas}, Product: "${ing.product.replace(/"/g, '\\"')}"${note}},`;
  }).join('\n');
  return `[]Ingredient{\n${inner}\n\t}`;
}

function buildGoString(fm: Record<string, unknown>, ingredients: StructuredIngredient[]): string {
  const varName = toGoVarName((fm.title as string) || 'Recipe');
  const instructions = Array.isArray(fm.instructions) ? (fm.instructions as string[]) : [];
  const tags = Array.isArray(fm.tags) ? (fm.tags as string[]) : [];

  const tagLiteral = tags.length === 0
    ? '[]Tag{}'
    : `[]Tag{${tags.map(t => `"${t}"`).join(', ')}}`;

  const instructionLiteral = instructions.length === 0
    ? '[]Step{}'
    : `[]Step{\n${instructions.map(s => `\t\t"${s.replace(/"/g, '\\"')}",`).join('\n')}\n\t}`;

  return [
    'package recipes',
    '',
    'type Tag string',
    '',
    'type Ingredient struct {',
    '\tQuantity    float64',
    '\tMeasurement string',
    '\tProduct     string',
    '\tNote        string',
    '}',
    '',
    'type Step string',
    '',
    'type Recipe struct {',
    '\tTitle        string',
    '\tPrepTime     string',
    '\tCookTime     string',
    '\tServings     int',
    '\tDifficulty   string',
    '\tTags         []Tag',
    '\tIngredients  []Ingredient',
    '\tInstructions []Step',
    '}',
    '',
    `var ${varName} = Recipe{`,
    `\tTitle:      "${(fm.title as string || '').replace(/"/g, '\\"')}",`,
    `\tPrepTime:   "${fm.prepTime || ''}",`,
    `\tCookTime:   "${fm.cookTime || ''}",`,
    `\tServings:   ${fm.servings || 0},`,
    `\tDifficulty: "${fm.difficulty || ''}",`,
    `\tTags:       ${tagLiteral},`,
    `\tIngredients: ${goIngredientSlice(ingredients)},`,
    `\tInstructions: ${instructionLiteral},`,
    '}',
  ].join('\n');
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipePath = path.join(process.cwd(), 'app/recipes', `${slug}.mdx`);

  if (!fs.existsSync(recipePath)) return notFound();

  let frontmatter: Record<string, unknown>;
  let mdxSource: Awaited<ReturnType<typeof compileMDX>>;

  try {
    const source = fs.readFileSync(recipePath, 'utf-8');
    const parsed = matter(source);
    frontmatter = parsed.data;
    mdxSource = await compileMDX({
      source: parsed.content,
      components: mdxComponents,
      options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
    });
  } catch (error) {
    console.error('Error loading recipe:', error);
    return notFound();
  }

  const formattedDate = frontmatter.date
    ? new Date(frontmatter.date as string).toISOString().slice(0, 10)
    : '';

  const prepTime = frontmatter.prepTime as string | undefined;
  const cookTime = frontmatter.cookTime as string | undefined;

  const metaParts = [
    prepTime ? `Prep: ${formatDuration(prepTime)}` : null,
    cookTime ? `Cook: ${formatDuration(cookTime)}` : null,
    frontmatter.servings ? `Serves: ${frontmatter.servings}` : null,
    frontmatter.difficulty ? `Difficulty: ${frontmatter.difficulty}` : null,
  ].filter(Boolean);

  const ingredients: StructuredIngredient[] = Array.isArray(frontmatter.ingredients)
    ? (frontmatter.ingredients as StructuredIngredient[])
    : [];

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: frontmatter.title,
    description: frontmatter.excerpt,
    datePublished: formattedDate || undefined,
    prepTime: prepTime || undefined,
    cookTime: cookTime || undefined,
    recipeYield: frontmatter.servings ? `${frontmatter.servings} servings` : undefined,
    keywords: Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]).join(', ') : undefined,
    recipeIngredient: ingredients.map(ing =>
      [ing.quantity, ing.measurement, ing.product, ing.note].filter(Boolean).join(' ')
    ),
    recipeInstructions: Array.isArray(frontmatter.instructions)
      ? (frontmatter.instructions as string[]).map(text => ({ '@type': 'HowToStep', text }))
      : undefined,
  };

  const codeString = buildGoString(frontmatter, ingredients);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <Link href="/recipes" className="text-green-400 hover:text-green-300 hover:underline text-sm mb-6 inline-block">
            ← All recipes
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-green-400">
            {(frontmatter.title as string) || 'Untitled Recipe'}
          </h1>
          {metaParts.length > 0 && (
            <div className="mb-3 text-gray-400 text-sm font-mono">
              {metaParts.join('  |  ')}
            </div>
          )}
          {formattedDate && (
            <div className="mb-4 text-gray-500 text-sm">{formattedDate}</div>
          )}
          {Array.isArray(frontmatter.tags) && (frontmatter.tags as string[]).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {(frontmatter.tags as string[]).map((tag) => (
                <Link key={tag} href={`/recipes?tag=${encodeURIComponent(tag)}`}>
                  <Badge
                    variant="secondary"
                    className="bg-gray-700 text-gray-300 hover:bg-green-500/20 hover:text-green-400 cursor-pointer transition-colors"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
          <RecipeViewer codeString={codeString} ingredients={ingredients}>
            {mdxSource.content}
          </RecipeViewer>
        </div>
      </main>
      <Footer />
    </div>
  );
}
