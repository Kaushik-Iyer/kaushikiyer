// src/app/education/[slug]/page.tsx
import Layout from "@/app/components/layout/Layout";
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getEducation, getEducationBySlug } from '@/lib/data';
import { PortableTextRenderer } from '@/app/components/PortableTextRenderer';

export async function generateStaticParams() {
  const items = getEducation();
  return items.map((item) => ({
    slug: item.slug,
  }));
}

// Type for params in Next.js 15
type Params = Promise<{ slug: string }>

export default async function EducationItemPage({ params }: { params: Params }) {
  const { slug } = await params;
  const item = getEducationBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <Layout>
      <article className="max-w-2xl mx-auto p-4 sm:p-6 bg-background text-text border border-accent rounded-lg shadow-xl my-8">
        <div className="flex flex-col sm:flex-row items-center mb-8 pb-6 border-b border-accent">
          {item.institutionLogo && (
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 relative rounded-lg overflow-hidden border border-accent/50 shadow-sm mb-4 sm:mb-0 sm:mr-6">
              <Image
                src={item.institutionLogo}
                alt={`${item.institution} logo`}
                fill
                className="object-contain"
              />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 text-text">{item.degree}</h1>
            <p className="text-lg sm:text-xl text-text/80 mb-1">{item.institution}</p>
            <p className="text-md text-text/60">
              {item.startDate.replace('-', '/')} – {item.endDate.replace('-', '/')}
            </p>
          </div>
        </div>
        
        {item.description && (
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-text dark:prose-invert">
            <PortableTextRenderer value={item.description} />
          </div>
        )}
      </article>
    </Layout>
  );
}
