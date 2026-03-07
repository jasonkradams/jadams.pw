import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import remarkGfm from 'remark-gfm';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import RecipeViewer from '../../components/RecipeViewer';
import { getAllRecipes } from '../recipes-index';
import { mdxComponents } from '../../components/mdx-components';
import { Badge } from '@/components/ui/badge';

export async function generateStaticParams() {
  return getAllRecipes().map(recipe => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getAllRecipes().find(r => r.slug === slug);
  return { title: recipe?.title ?? slug };
}

/** Convert ISO 8601 duration (e.g. "PT1H30M") to a readable string ("1h 30min") */
function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const hours = match[1] ? `${match[1]}h ` : '';
  const mins = match[2] ? `${match[2]}min` : '';
  return (hours + mins).trim() || iso;
}

/** Convert a recipe title to a Go-idiomatic PascalCase var name */
function toGoVarName(title: string): string {
  return title
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '');
}

function goStringSlice(items: string[]): string {
  if (items.length === 0) return '[]string{}';
  const inner = items.map(s => `\t\t"${s.replace(/"/g, '\\"')}",`).join('\n');
  return `[]string{\n${inner}\n\t}`;
}

function buildGoString(fm: Record<string, unknown>): string {
  const varName = toGoVarName((fm.title as string) || 'Recipe');
  const ingredients = Array.isArray(fm.ingredients) ? (fm.ingredients as string[]) : [];
  const instructions = Array.isArray(fm.instructions) ? (fm.instructions as string[]) : [];
  const tags = Array.isArray(fm.tags) ? (fm.tags as string[]) : [];

  const tagLiteral = tags.length === 0
    ? '[]string{}'
    : `[]string{${tags.map(t => `"${t}"`).join(', ')}}`;

  return [
    'package recipes',
    '',
    'type Recipe struct {',
    '\tTitle        string',
    '\tPrepTime     string',
    '\tCookTime     string',
    '\tServings     int',
    '\tDifficulty   string',
    '\tTags         []string',
    '\tIngredients  []string',
    '\tInstructions []string',
    '}',
    '',
    `var ${varName} = Recipe{`,
    `\tTitle:      "${(fm.title as string || '').replace(/"/g, '\\"')}",`,
    `\tPrepTime:   "${fm.prepTime || ''}",`,
    `\tCookTime:   "${fm.cookTime || ''}",`,
    `\tServings:   ${fm.servings || 0},`,
    `\tDifficulty: "${fm.difficulty || ''}",`,
    `\tTags:       ${tagLiteral},`,
    `\tIngredients: ${goStringSlice(ingredients)},`,
    `\tInstructions: ${goStringSlice(instructions)},`,
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
    recipeIngredient: Array.isArray(frontmatter.ingredients) ? frontmatter.ingredients : undefined,
    recipeInstructions: Array.isArray(frontmatter.instructions)
      ? (frontmatter.instructions as string[]).map(text => ({ '@type': 'HowToStep', text }))
      : undefined,
  };

  const codeString = buildGoString(frontmatter);

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
              {(frontmatter.tags as string[]).map((tag, i) => (
                <Link key={i} href={`/recipes?tag=${encodeURIComponent(tag)}`}>
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
          <RecipeViewer codeString={codeString}>
            {mdxSource.content}
          </RecipeViewer>
        </div>
      </main>
      <Footer />
    </div>
  );
}
