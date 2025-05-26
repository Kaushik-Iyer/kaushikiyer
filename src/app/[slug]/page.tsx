// src/app/[slug]/page.tsx
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client"; // Updated import path
import Layout from "@/app/components/layout/Layout";
import { PortableText } from "@portabletext/react";
import { notFound } from 'next/navigation'; // Import notFound

// Define types for Portable Text blocks
interface PortableTextSpan {
  _type: 'span';
  text: string;
  marks?: string[];
}

interface PortableTextBlock {
  _type: 'block';
  _key: string;
  children: PortableTextSpan[];
  style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
  markDefs?: Array<{
    _key: string;
    _type: string;
    href?: string;
  }>;
}

interface Post extends SanityDocument {
  title: string;
  slug: { current: string };
  publishedAt: string;
  body: PortableTextBlock[]; // Changed from any[]
}

// Define your query
const SINGLE_POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id, title, slug, publishedAt, body
}`;

// For generating static paths
export async function generateStaticParams() {
  const postsData = await client.fetch<{ slug: string }[]>( // Type changed for accuracy
    `*[_type == "post" && defined(slug.current)]{"slug": slug.current}`
  );
  return postsData.map((post) => ({
    slug: post.slug, // Changed from post.slug.current
  }));
}

const revalidateOptions = { next: { revalidate: 60 } };

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await client.fetch<Post>(
    SINGLE_POST_QUERY,
    { slug: params.slug },
    revalidateOptions
  );

  if (!post) {
    notFound(); // If post not found, trigger 404
  }

  return (
    <Layout>
      <article className="bg-background text-text p-6 rounded-lg shadow-xl border border-accent my-8"> {/* Added theme classes */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-text">{post.title}</h1> {/* Ensured text-text */}
        <p className="text-sm text-text/70 mb-8"> {/* Changed text-black/60 */}
          Published on: {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {post.body && (
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-text dark:prose-invert"> {/* Added text-text, dark:prose-invert */}
            <PortableText value={post.body} />
          </div>
        )}
      </article>
    </Layout>
  );
}