// src/app/experience/[slug]/page.tsx
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Layout from "@/app/components/layout/Layout";
import { PortableText } from "@portabletext/react";
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface ExperienceItem extends SanityDocument {
  jobTitle: string;
  company: string;
  slug: { current: string };
  startDate: string;
  endDate: string;
  companyLogo?: any;
  location?: string;
  description?: any[]; // Portable Text
  tags?: string[];
}

const SINGLE_EXPERIENCE_QUERY = `*[_type == "experience" && slug.current == $slug][0]{
  _id, jobTitle, company, slug, startDate, endDate, companyLogo, location, description, tags
}`;

export async function generateStaticParams() {
  const items = await client.fetch<{ slug: string }[]>( 
    `*[_type == "experience" && defined(slug.current)]{ "slug": slug.current }`
  );
  return items.map((item) => ({
    slug: item.slug,
  }));
}

const revalidateOptions = { next: { revalidate: 60 } };

export default async function ExperienceItemPage({ params }: { params: { slug: string } }) {
  const item = await client.fetch<ExperienceItem>(
    SINGLE_EXPERIENCE_QUERY,
    { slug: params.slug },
    revalidateOptions
  );

  if (!item) {
    notFound();
  }

  return (
    <Layout>
      <article className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center mb-8 pb-6 border-b border-black/10">
          {item.companyLogo && (
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 relative rounded-lg overflow-hidden border border-black/10 shadow-sm mb-4 sm:mb-0 sm:mr-6">
              <Image
                src={urlFor(item.companyLogo).width(200).height(200).fit('contain').url()}
                alt={`${item.company} logo`}
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">{item.jobTitle}</h1>
            <p className="text-lg sm:text-xl text-black/80 mb-1">
              {item.company} {item.location && <span className="text-base text-black/60">({item.location})</span>}
            </p>
            <p className="text-md text-black/60">
              {item.startDate.replace('-', '/')} – {item.endDate.replace('-', '/')}
            </p>
          </div>
        </div>
        
        {item.description && (
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8">
            <h2 class="text-xl font-semibold mb-3">Responsibilities & Achievements:</h2>
            <PortableText value={item.description} />
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-black/10">
            <h3 className="text-lg font-semibold mb-2">Skills/Technologies Used:</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
}
