// src/app/testimonials/page.tsx
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from "@portabletext/react"; // Import PortableText

interface Testimonial extends SanityDocument {
  personName: string;
  relation?: string;
  testimonialContent: any[]; // Portable Text
  slug: { current: string };
  personImage?: any;
  testimonialDate?: string;
}

const TESTIMONIALS_QUERY = `*[_type == "testimonial"]|order(testimonialDate desc, orderRank asc){
  _id, personName, relation, testimonialContent, slug, personImage, testimonialDate
}`;

const revalidateOptions = { next: { revalidate: 60 } };

// Helper to truncate Portable Text for preview (basic implementation)
const truncatePortableText = (blocks: any[], maxLength: number) => {
  if (!blocks || !Array.isArray(blocks)) return '';
  let currentLength = 0;
  const truncatedBlocks = [];
  for (const block of blocks) {
    if (block._type === 'block' && block.children) {
      for (const span of block.children) {
        if (span._type === 'span' && span.text) {
          if (currentLength + span.text.length > maxLength) {
            const remainingLength = maxLength - currentLength;
            const newText = span.text.substring(0, remainingLength) + '...';
            truncatedBlocks.push({ ...block, children: [{ ...span, text: newText }] });
            currentLength += remainingLength;
            return truncatedBlocks; // Return as soon as truncated
          }
          currentLength += span.text.length;
        }
      }
    }
    truncatedBlocks.push(block);
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
      <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Testimonials</h1>
      {testimonials && testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.map((item) => (
            <Link key={item._id} href={`/testimonials/${item.slug.current}`} className="block group">
              <div className="p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white">
                <div className="prose prose-sm max-w-none mb-4 flex-grow text-gray-700">
                  <PortableText value={truncatePortableText(item.testimonialContent, 200)} />
                </div>
                <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                  {item.personImage && (
                    <div className="flex-shrink-0 w-12 h-12 relative rounded-full overflow-hidden mr-4 border border-gray-300">
                      <Image
                        src={urlFor(item.personImage).width(60).height(60).fit('crop').url()}
                        alt={`${item.personName}`}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{item.personName}</p>
                    {item.relation && <p className="text-sm text-gray-500">{item.relation}</p>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No testimonials found yet. Add some in the Sanity Studio!</p>
      )}
    </Layout>
  );
}
