import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
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
  const { content, data } = matter(source);
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <Header />
      <main className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-4 text-green-400">{data.title}</h1>
          <div className="mb-8 text-gray-400 text-sm">
            <span>{new Date(data.date).toLocaleDateString()}</span>
            {data.readTime && <span className="ml-4">{data.readTime}</span>}
          </div>
          <article className="prose prose-invert max-w-none">
            <MDXRemote source={content} />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
