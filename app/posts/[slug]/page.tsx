import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getAllPosts } from '../blog-index';

export async function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postPath = path.join(process.cwd(), 'app/posts', `${slug}.mdx`);
  if (!fs.existsSync(postPath)) return notFound();
  const source = fs.readFileSync(postPath, 'utf-8');
  const { content, frontmatter } = await compileMDX<{ title: string; date: string; readTime?: string }>({
    source,
    options: { parseFrontmatter: true },
  });

  // Format the date on the server to a fixed, robust format
  const formattedDate = new Date(frontmatter.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono flex flex-col">
      <Header />
      <main className="flex-1 py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-4 text-green-400">{frontmatter.title}</h1>
          <div className="mb-8 text-gray-400 text-sm">
            <span>{formattedDate}</span>
            {frontmatter.readTime && <span className="ml-4">{frontmatter.readTime}</span>}
          </div>
          <article className="prose prose-invert max-w-none">
            {content}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
