import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { getAllPosts } from './blog-index';

const blogPosts = getAllPosts();

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold mb-10 text-green-400">All Posts</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span className="ml-2">{post.readTime}</span>
                </div>
                <CardTitle className="text-gray-100 group-hover:text-green-400 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-gray-400 leading-relaxed">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(post.tags || []).map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="secondary"
                      className="bg-gray-700 text-gray-300 hover:bg-green-500/20 hover:text-green-400"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/posts/${post.slug}`} className="text-green-400 hover:text-green-300 hover:underline">
  Read more →
</Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
