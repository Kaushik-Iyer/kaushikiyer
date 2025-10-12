// src/app/testimonials/page.tsx
import Link from "next/link";
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { getTestimonials } from '@/lib/data';
import type { Testimonial } from '@/lib/types'; 

// Helper function to truncate testimonial text
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

export default async function TestimonialsPage() {
  const testimonials = getTestimonials();

  return (
    <Layout>
      <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-text">Testimonials</h1>
      {testimonials && testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.map((item) => (
            <Link key={item.id} href={`/testimonials/${item.slug}`} className="block group">
              <div className="p-6 border border-accent rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-background">
                <div className="prose prose-sm max-w-none mb-4 flex-grow text-text dark:prose-invert">
                  <p>{truncateText(item.testimonialContent, 200)}</p>
                </div>
                <div className="flex items-center mt-auto pt-4 border-t border-accent/50">
                  {item.personImage && (
                    <div className="flex-shrink-0 w-12 h-12 relative rounded-full overflow-hidden mr-4 border border-accent">
                      <Image
                        src={item.personImage}
                        alt={`${item.personName}`}
                        fill
                        className="object-cover"
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
        <p className="text-center text-text/70">No testimonials found yet.</p>
      )}
    </Layout>
  );
}
