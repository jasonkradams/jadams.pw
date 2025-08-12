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

export default async function PostPage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  // Handle both direct params and Promise<params>
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  const postPath = path.join(process.cwd(), 'app/posts', `${slug}.mdx`);
  
  if (!fs.existsSync(postPath)) return notFound();
  
  try {
    const source = fs.readFileSync(postPath, 'utf-8');
    const { content, data: frontmatter } = matter(source);
    
    // Format the date on the server to a fixed, robust format
    const formattedDate = frontmatter.date ? new Date(frontmatter.date).toISOString().slice(0, 10) : '';
    
    // Compile the MDX content
    const mdxSource = await compileMDX({
      source: content,
      components: mdxComponents,
      options: { parseFrontmatter: true }
    });
    
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
        <Header />
        <main className="flex-1 py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold mb-4 text-green-400">
              {frontmatter.title || 'Untitled Post'}
            </h1>
            <div className="mb-8 text-gray-400 text-sm">
              {formattedDate && <span>{formattedDate}</span>}
              {frontmatter.readTime && <span className="ml-4">{frontmatter.readTime}</span>}
            </div>
            <article className="prose prose-invert max-w-none">
              {mdxSource.content}
            </article>
          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error rendering post:', error);
    return notFound();
  }
}
