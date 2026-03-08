import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import RecipeViewer from '@/app/components/RecipeViewer';
import { getAllRecipes, type StructuredIngredient, type StructuredStep, type NutritionRow } from '../recipes-index';
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

function goStringSlice(label: string, items: string[]): string {
  if (items.length === 0) return `[]${label}{}`;
  const inner = items.map(s => `\t\t"${s.replace(/"/g, '\\"')}",`).join('\n');
  return `[]${label}{\n${inner}\n\t}`;
}

function goIngredientSlice(ingredients: StructuredIngredient[]): string {
  if (ingredients.length === 0) return '[]Ingredient{}';
  const inner = ingredients.map(ing => {
    const note = ing.note ? `, Note: "${ing.note.replace(/"/g, '\\"')}"` : '';
    const meas = ing.measurement ? `"${ing.measurement.replace(/"/g, '\\"')}"` : '""';
    return `\t\t{Quantity: ${ing.quantity}, Measurement: ${meas}, Product: "${ing.product.replace(/"/g, '\\"')}"${note}},`;
  }).join('\n');
  return `[]Ingredient{\n${inner}\n\t}`;
}

function goStepSlice(steps: StructuredStep[]): string {
  if (steps.length === 0) return '[]Step{}';
  const inner = steps.map(s => {
    const title = (s.title ?? '').replace(/"/g, '\\"');
    const instruction = s.instruction.replace(/"/g, '\\"');
    return `\t\t{Title: "${title}", Instruction: "${instruction}"},`;
  }).join('\n');
  return `[]Step{\n${inner}\n\t}`;
}

function buildGoString(fm: Record<string, unknown>, ingredients: StructuredIngredient[], steps: StructuredStep[]): string {
  const varName = toGoVarName((fm.title as string) || 'Recipe');
  const tags = Array.isArray(fm.tags) ? (fm.tags as string[]) : [];
  const equipment = Array.isArray(fm.equipment) ? (fm.equipment as string[]) : [];
  const tips = Array.isArray(fm.tips) ? (fm.tips as string[]) : [];

  const equipmentField = equipment.length > 0
    ? `\n\tEquipment:    ${goStringSlice('string', equipment)},`
    : '';
  const tipsField = tips.length > 0
    ? `\n\tTips:         ${goStringSlice('string', tips)},`
    : '';

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
    'type Step struct {',
    '\tTitle       string',
    '\tInstruction string',
    '}',
    '',
    'type Recipe struct {',
    '\tTitle        string',
    '\tDescription  string',
    '\tImage        string',
    '\tPrepTime     string',
    '\tCookTime     string',
    '\tServings     int',
    '\tDifficulty   string',
    '\tTags         []Tag',
    '\tEquipment    []string',
    '\tIngredients  []Ingredient',
    '\tInstructions []Step',
    '\tTips         []string',
    '}',
    '',
    `var ${varName} = Recipe{`,
    `\tTitle:        "${(fm.title as string || '').replace(/"/g, '\\"')}",`,
    `\tDescription:  "${((fm.description as string) || '').replace(/"/g, '\\"')}",`,
    `\tImage:        "${(fm.image as string) || ''}",`,
    `\tPrepTime:     "${fm.prepTime || ''}",`,
    `\tCookTime:     "${fm.cookTime || ''}",`,
    `\tServings:     ${fm.servings || 0},`,
    `\tDifficulty:   "${fm.difficulty || ''}",`,
    `\tTags:         ${goStringSlice('Tag', tags)},`,
    `${equipmentField ? equipmentField + '\n' : ''}\tIngredients:  ${goIngredientSlice(ingredients)},`,
    `\tInstructions: ${goStepSlice(steps)},`,
    `${tipsField ? tipsField + '\n' : ''}` + '}',
  ].join('\n');
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipePath = path.join(process.cwd(), 'app/recipes', `${slug}.mdx`);

  if (!fs.existsSync(recipePath)) return notFound();

  const source = fs.readFileSync(recipePath, 'utf-8');
  const { data: frontmatter } = matter(source);

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

  const instructions: StructuredStep[] = Array.isArray(frontmatter.instructions)
    ? (frontmatter.instructions as StructuredStep[])
    : [];

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: frontmatter.title,
    description: frontmatter.description || frontmatter.excerpt,
    datePublished: formattedDate || undefined,
    prepTime: prepTime || undefined,
    cookTime: cookTime || undefined,
    recipeYield: frontmatter.servings ? `${frontmatter.servings} servings` : undefined,
    keywords: Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]).join(', ') : undefined,
    recipeIngredient: ingredients.map(ing =>
      [ing.quantity, ing.measurement, ing.product, ing.note].filter(Boolean).join(' ')
    ),
    recipeInstructions: instructions.map(s => ({
      '@type': 'HowToStep',
      name: s.title ?? undefined,
      text: s.instruction,
    })),
  };

  const codeString = buildGoString(frontmatter, ingredients, instructions);

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
          <RecipeViewer
            codeString={codeString}
            description={frontmatter.description as string | undefined}
            image={frontmatter.image as string | undefined}
            equipment={Array.isArray(frontmatter.equipment) ? (frontmatter.equipment as string[]) : []}
            ingredients={ingredients}
            instructions={instructions}
            tips={Array.isArray(frontmatter.tips) ? (frontmatter.tips as string[]) : []}
            nutrition={Array.isArray(frontmatter.nutrition) ? (frontmatter.nutrition as NutritionRow[]) : []}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
