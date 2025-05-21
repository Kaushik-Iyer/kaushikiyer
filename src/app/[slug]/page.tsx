// src/app/[slug]/page.tsx
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client"; // Updated import path
import Layout from "@/app/components/layout/Layout";
import { PortableText } from "@portabletext/react";
import { notFound } from 'next/navigation'; // Import notFound

interface Post extends SanityDocument {
  title: string;
  slug: { current: string };
  publishedAt: string;
  body: any[]; // Portable Text content
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
      <article>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-sm text-black/60 mb-8">
          Published on: {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {post.body && (
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
            <PortableText value={post.body} />
          </div>
        )}
      </article>
    </Layout>
  );
}