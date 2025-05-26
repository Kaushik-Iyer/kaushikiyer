import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Layout from "@/app/components/layout/Layout";
import { PortableText } from "@portabletext/react";

// Define types for Portable Text content
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
  body?: PortableTextBlock[]; // For a short excerpt or preview
}

const ALL_POSTS_QUERY = `*[_type == "post" && defined(slug.current)]|order(publishedAt desc){
  _id, title, slug, publishedAt, body
}`;

const revalidateOptions = { next: { revalidate: 60 } }; // Revalidate every 60 seconds

// Helper to truncate Portable Text for preview (can be moved to a utils file)
const truncatePortableText = (blocks: PortableTextBlock[], maxLength: number) => {
  if (!blocks || !Array.isArray(blocks)) return [];
  let currentLength = 0;
  const truncatedBlocks = [];
  for (const block of blocks) {
    if (block._type === 'block' && block.children) {
      const newChildren = [];
      for (const span of block.children) {
        if (span._type === 'span' && span.text) {
          if (currentLength + span.text.length > maxLength) {
            const remainingLength = maxLength - currentLength;
            if (remainingLength <= 0) {
                 newChildren.push({ ...span, text: '...' });
                 currentLength = maxLength;
                 break; 
            }
            newChildren.push({ ...span, text: span.text.substring(0, remainingLength) + '...' });
            currentLength += remainingLength;
            break; 
          }
          newChildren.push(span);
          currentLength += span.text.length;
        } else {
          newChildren.push(span);
        }
      }
      truncatedBlocks.push({ ...block, children: newChildren });
      if (currentLength >= maxLength) break; 
    } else {
      truncatedBlocks.push(block); 
    }
  }
  return truncatedBlocks;
};

export default async function BlogIndexPage() {
  const posts = await client.fetch<Post[]>(
    ALL_POSTS_QUERY,
    {},
    revalidateOptions
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-text">
          Blog
        </h1>
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post._id} href={`/${post.slug.current}`} className="block group">
                <div className="p-6 border border-accent rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-background">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2 group-hover:text-primary text-text">
                    {post.title}
                  </h2>
                  {post.body && (
                    <div className="prose prose-sm max-w-none text-text/70 line-clamp-3 mb-3 flex-grow dark:prose-invert">
                       <PortableText value={truncatePortableText(post.body, 150)} />
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
