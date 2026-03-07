import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import Link from 'next/link';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getAllRecipes } from '../recipes-index';
import { mdxComponents } from '../../components/mdx-components';

export async function generateStaticParams() {
  return getAllRecipes().map(recipe => ({ slug: recipe.slug }));
}

/** Convert ISO 8601 duration (e.g. "PT1H30M") to a readable string ("1h 30min") */
function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const hours = match[1] ? `${match[1]}h ` : '';
  const mins = match[2] ? `${match[2]}min` : '';
  return (hours + mins).trim() || iso;
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
      options: { parseFrontmatter: true },
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
  };

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
            <div className="mb-8 text-gray-500 text-sm">{formattedDate}</div>
          )}
          <article className="prose prose-invert max-w-none">
            {mdxSource.content}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
