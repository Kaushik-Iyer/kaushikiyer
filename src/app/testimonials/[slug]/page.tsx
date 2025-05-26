// /home/kaushik/portfolio/src/app/testimonials/[slug]/page.tsx
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Layout from "@/app/components/layout/Layout";
import { PortableText } from "@portabletext/react";
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
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
  personName: string; // Changed from name
  slug: { current: string };
  relation?: string; // Changed from company/role to a single relation field
  testimonialContent: PortableTextBlock[]; // Changed from testimonial, Portable Text
  personImage?: SanityImage; // Changed from avatar
  testimonialDate?: string; // Changed from date
}

const SINGLE_TESTIMONIAL_QUERY = `*[_type == "testimonial" && slug.current == $slug][0]{
  _id, personName, slug, relation, testimonialContent, personImage, testimonialDate
}`;

export async function generateStaticParams() {
  const testimonialsData = await client.fetch<{ slug: string }[]>(
    `*[_type == "testimonial" && defined(slug.current)]{ "slug": slug.current }`
  );
  return testimonialsData.map((testimonial) => ({
    slug: testimonial.slug,
  }));
}

const revalidateOptions = { next: { revalidate: 60 } };

// Type for params in Next.js 15
type Params = Promise<{ slug: string }>

export default async function TestimonialPage({ params }: { params: Params }) {
  const { slug } = await params;
  const testimonial = await client.fetch<Testimonial>(
    SINGLE_TESTIMONIAL_QUERY,
    { slug },
    revalidateOptions
  );

  if (!testimonial) {
    notFound();
  }

  return (
    <Layout>
      <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-background shadow-xl rounded-lg mt-8 mb-8 border border-accent"> {/* Changed bg-white to bg-background, added border-accent */}
        <div className="text-center mb-10">
          {testimonial.personImage && (
            <div className="mb-6 inline-block">
              <Image
                src={urlFor(testimonial.personImage).width(150).height(150).fit('crop').url()}
                alt={testimonial.personName}
                width={150}
                height={150}
                className="rounded-full shadow-lg border-4 border-accent" // Changed border-gray-200 to border-accent
              />
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold text-text">{testimonial.personName}</h1> {/* Changed text-gray-900 to text-text */}
          {testimonial.relation && <p className="text-xl text-secondary mt-2">{testimonial.relation}</p>} {/* Changed text-gray-600 to text-secondary */}
          {testimonial.testimonialDate && (
            <p className="text-md text-text/70 mt-3"> {/* Changed text-gray-500 to text-text/70 */}
              {new Date(testimonial.testimonialDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>

        {testimonial.testimonialContent && (
          <div className="prose prose-lg sm:prose-xl max-w-none text-text leading-relaxed dark:prose-invert"> {/* Changed text-gray-800 to text-text, added dark:prose-invert for better dark mode prose */}
            <PortableText value={testimonial.testimonialContent} />
          </div>
        )}
      </article>
    </Layout>
  );
}
