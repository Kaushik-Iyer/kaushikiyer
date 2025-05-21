// src/app/page.tsx
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client"; // Uses the alias for src/sanity/lib/client.ts
import Layout from "@/app/components/layout/Layout";

interface Post extends SanityDocument {
  title: string;
  slug: { current: string };
  publishedAt: string;
}

// Define your query directly here or import from src/sanity/queries.ts
const POSTS_QUERY = `*[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0...12]{
  _id, title, slug, publishedAt
}`;

const revalidateOptions = { next: { revalidate: 60 } }; // e.g., revalidate every 60 seconds

export default async function HomePage() {
  const posts = await client.fetch<Post[]>(
    POSTS_QUERY,
    {},
    revalidateOptions
  );

  return (
    <Layout>
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">Blog Posts</h1>
      {posts && posts.length > 0 ? (
        <ul className="flex flex-col gap-y-6">
          {posts.map((post) => (
            <li key={post._id}>
              <Link href={`/${post.slug.current}`} className="block group hover:no-underline"> {/* Link to /slug */}
                <h2 className="text-xl sm:text-2xl font-semibold mb-1 group-hover:underline">
                  {post.title}
                </h2>
                <p className="text-sm text-black/60">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </Layout>
  );
}