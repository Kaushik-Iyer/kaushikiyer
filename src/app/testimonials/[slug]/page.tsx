// /home/kaushik/portfolio/src/app/testimonials/[slug]/page.tsx
import Layout from "@/app/components/layout/Layout";
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTestimonials, getTestimonialBySlug } from '@/lib/data';
import { PortableTextRenderer } from '@/app/components/PortableTextRenderer';

export async function generateStaticParams() {
  const testimonials = getTestimonials();
  return testimonials.map((testimonial) => ({
    slug: testimonial.slug,
  }));
}

// Type for params in Next.js 15
type Params = Promise<{ slug: string }>

export default async function TestimonialPage({ params }: { params: Params }) {
  const { slug } = await params;
  const testimonial = getTestimonialBySlug(slug);

  if (!testimonial) {
    notFound();
  }

  return (
    <Layout>
      <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-background shadow-xl rounded-lg mt-8 mb-8 border border-accent">
        <div className="text-center mb-10">
          {testimonial.personImage && (
            <div className="mb-6 inline-block">
              <Image
                src={testimonial.personImage}
                alt={testimonial.personName}
                width={150}
                height={150}
                className="rounded-full shadow-lg border-4 border-accent"
              />
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold text-text">{testimonial.personName}</h1>
          {testimonial.relation && <p className="text-xl text-secondary mt-2">{testimonial.relation}</p>}
          {testimonial.testimonialDate && (
            <p className="text-md text-text/70 mt-3">
              {new Date(testimonial.testimonialDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>

        {testimonial.testimonialContent && (
          <div className="prose prose-lg sm:prose-xl max-w-none text-text leading-relaxed dark:prose-invert">
            <PortableTextRenderer value={testimonial.testimonialContent} />
          </div>
        )}
      </article>
    </Layout>
  );
}
