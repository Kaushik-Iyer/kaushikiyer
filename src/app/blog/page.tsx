import Link from "next/link";
import Layout from "@/app/components/layout/Layout";
import { getPosts } from '@/lib/data';
import type { Post } from '@/lib/types';

// Helper to truncate text for preview
const truncateText = (blocks: any[] = [], maxLength: number): string => {
  if (!blocks || !Array.isArray(blocks)) return '';
  let text = '';
  for (const block of blocks) {
    if (block._type === 'block' && block.children) {
      for (const span of block.children) {
        if (span.text) {
          text += span.text;
          if (text.length >= maxLength) {
            return text.substring(0, maxLength) + '...';
          }
        }
      }
    }
  }
  return text;
};

export default async function BlogIndexPage() {
  const posts = getPosts();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-text">
          Blog
        </h1>
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/${post.slug}`} className="block group">
                <div className="p-6 border border-accent rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-background">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2 group-hover:text-primary text-text">
                    {post.title}
                  </h2>
                  {post.body && (
                    <div className="prose prose-sm max-w-none text-text/70 line-clamp-3 mb-3 flex-grow dark:prose-invert">
                       <p>{truncateText(post.body, 150)}</p>
                    </div>
                  )}
                  <p className="text-sm text-text/60 mt-auto">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-text/70">No blog posts found yet. Stay tuned!</p>
        )}
      </div>
    </Layout>
  );
}
