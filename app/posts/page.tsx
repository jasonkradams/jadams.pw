import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostList from './PostList';
import { getAllPosts } from './blog-index';

export const metadata: Metadata = {
  title: 'Posts',
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono flex flex-col">
      <Header />
      <main className="flex-1 py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold mb-10 text-green-400">All Posts</h1>
          <Suspense>
            <PostList posts={posts} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
