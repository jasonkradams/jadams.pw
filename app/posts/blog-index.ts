import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  tags?: string[];
}

export function getAllPosts(): BlogPostMeta[] {
  const postsDir = path.join(process.cwd(), 'app/posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'));
  return files.map(file => {
    const slug = file.replace(/\.mdx$/, '');
    const source = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { data, content } = matter(source);
    return {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || content.slice(0, 180),
      date: data.date || '',
      readTime: data.readTime,
      tags: data.tags || [],
    };
  });
}
