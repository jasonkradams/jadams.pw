import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getAllPosts } from '../blog-index';
import { mdxComponents } from '../../components/mdx-components';

export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const { slug } = await params;
  const postPath = path.join(process.cwd(), 'app/posts', `${slug}.mdx`);
  
  if (!fs.existsSync(postPath)) return notFound();

  let source: string;
  let frontmatter: Record<string, unknown>;
  let mdxSource: Awaited<ReturnType<typeof compileMDX>>;

  try {
    source = fs.readFileSync(postPath, 'utf-8');
    const parsed = matter(source);
    frontmatter = parsed.data;
    mdxSource = await compileMDX({
      source: parsed.content,
      components: mdxComponents,
      options: { parseFrontmatter: true },
    });
  } catch (error) {
    console.error('Error loading post:', error);
    return notFound();
  }

  const formattedDate = frontmatter.date
    ? new Date(frontmatter.date as string).toISOString().slice(0, 10)
    : '';

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-1 py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-4 text-green-400">
            {(frontmatter.title as string) || 'Untitled Post'}
          </h1>
          <div className="mb-8 text-gray-400 text-sm">
            {formattedDate && <span>{formattedDate}</span>}
            {typeof frontmatter.readTime === 'string' && <span className="ml-4">{frontmatter.readTime}</span>}
          </div>
          <article className="prose prose-invert max-w-none">
            {mdxSource.content}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
