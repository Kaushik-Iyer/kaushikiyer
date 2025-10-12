// src/app/[slug]/page.tsx
import Layout from "@/app/components/layout/Layout";
import { notFound } from 'next/navigation';
import { getPosts, getPostBySlug } from '@/lib/data';
import { PortableTextRenderer } from '@/app/components/PortableTextRenderer';

// For generating static paths
export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Type for params in Next.js 15
type Params = Promise<{ slug: string }>

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <Layout>
      <article className="bg-background text-text p-6 rounded-lg shadow-xl border border-accent my-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-text">{post.title}</h1>
        <p className="text-sm text-text/70 mb-8">
          Published on: {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {post.body && (
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-text dark:prose-invert">
            <PortableTextRenderer value={post.body} />
          </div>
        )}
      </article>
    </Layout>
  );
}