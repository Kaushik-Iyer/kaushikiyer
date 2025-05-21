\
// /home/kaushik/portfolio/src/app/testimonials/[slug]/page.tsx
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Layout from "@/app/components/layout/Layout";
import { PortableText } from "@portabletext/react";
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface Testimonial extends SanityDocument {
  personName: string; // Changed from name
  slug: { current: string };
  relation?: string; // Changed from company/role to a single relation field
  testimonialContent: any[]; // Changed from testimonial, Portable Text
  personImage?: any; // Changed from avatar
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

export default async function TestimonialPage({ params }: { params: { slug: string } }) {
  const testimonial = await client.fetch<Testimonial>(
    SINGLE_TESTIMONIAL_QUERY,
    { slug: params.slug },
    revalidateOptions
  );

  if (!testimonial) {
    notFound();
  }

  return (
    <Layout>
      <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white shadow-xl rounded-lg mt-8 mb-8">
        <div className="text-center mb-10">
          {testimonial.personImage && (
            <div className="mb-6 inline-block">
              <Image
                src={urlFor(testimonial.personImage).width(150).height(150).fit('crop').url()}
                alt={testimonial.personName}
                width={150}
                height={150}
                className="rounded-full shadow-lg border-4 border-gray-200"
              />
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">{testimonial.personName}</h1>
          {testimonial.relation && <p className="text-xl text-gray-600 mt-2">{testimonial.relation}</p>}
          {testimonial.testimonialDate && (
            <p className="text-md text-gray-500 mt-3">
              {new Date(testimonial.testimonialDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>

        {testimonial.testimonialContent && (
          <div className="prose prose-lg sm:prose-xl max-w-none text-gray-800 leading-relaxed">
            <PortableText value={testimonial.testimonialContent} />
          </div>
        )}
      </article>
    </Layout>
  );
}
