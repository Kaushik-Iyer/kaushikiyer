// src/app/testimonials/page.tsx
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from "@portabletext/react"; 

// Define Sanity image type
interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

// Define PortableText block types
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

interface Testimonial extends SanityDocument {
  personName: string;
  relation?: string;
  testimonialContent: PortableTextBlock[];
  slug: { current: string };
  personImage?: SanityImage;
  testimonialDate?: string;
}

const TESTIMONIALS_QUERY = `*[_type == "testimonial"]|order(testimonialDate desc, orderRank asc){
  _id, personName, relation, testimonialContent, slug, personImage, testimonialDate
}`;

const revalidateOptions = { next: { revalidate: 60 } };

const truncatePortableText = (blocks: PortableTextBlock[] = [], maxLength: number): PortableTextBlock[] => {
  if (!blocks || !Array.isArray(blocks)) return [];
  let currentLength = 0;
  const truncatedBlocks: PortableTextBlock[] = [];
  for (const block of blocks) {
    if (block._type === 'block' && block.children) {
      const newChildren: PortableTextSpan[] = [];
      for (const span of block.children) {
        if (span._type === 'span' && span.text) {
          if (currentLength + span.text.length > maxLength) {
            const remainingLength = maxLength - currentLength;
            if (remainingLength <= 0) {
              newChildren.push({ ...span, text: '...' });
              currentLength = maxLength;
              break;
            }
            const newText = span.text.substring(0, remainingLength) + '...';
            newChildren.push({ ...span, text: newText });
            currentLength += remainingLength;
            break;
          }
          currentLength += span.text.length;
        }
        newChildren.push(span);
      }
      truncatedBlocks.push({ ...block, children: newChildren });
    } else {
      truncatedBlocks.push(block);
    }
    if (currentLength >= maxLength) break;
  }
  return truncatedBlocks;
};


export default async function TestimonialsPage() {
  const testimonials = await client.fetch<Testimonial[]>(
    TESTIMONIALS_QUERY,
    {},
    revalidateOptions
  );

  return (
    <Layout>
      <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-text">Testimonials</h1>
      {testimonials && testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.map((item) => (
            <Link key={item._id} href={`/testimonials/${item.slug.current}`} className="block group">
              <div className="p-6 border border-accent rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-background">
                <div className="prose prose-sm max-w-none mb-4 flex-grow text-text dark:prose-invert">
                  <PortableText value={truncatePortableText(item.testimonialContent, 200)} />
                </div>
                <div className="flex items-center mt-auto pt-4 border-t border-accent/50">
                  {item.personImage && (
                    <div className="flex-shrink-0 w-12 h-12 relative rounded-full overflow-hidden mr-4 border border-accent">
                      <Image
                        src={urlFor(item.personImage).width(60).height(60).fit('crop').url()}
                        alt={`${item.personName}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg text-text group-hover:text-primary transition-colors duration-300">{item.personName}</p>
                    {item.relation && <p className="text-sm text-text/70">{item.relation}</p>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-text/70">No testimonials found yet. Add some in the Sanity Studio!</p>
      )}
    </Layout>
  );
}
