// src/app/experience/[slug]/page.tsx
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

interface ExperienceItem extends SanityDocument {
  jobTitle: string;
  company: string;
  slug: { current: string };
  startDate: string;
  endDate: string;
  companyLogo?: SanityImage;
  location?: string;
  description?: PortableTextBlock[];
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
      <article className="max-w-3xl mx-auto p-4 sm:p-6 bg-background text-text border border-accent rounded-lg shadow-xl my-8"> {/* Added bg-background, text-text, border, margin */}
        <div className="flex flex-col sm:flex-row items-center mb-8 pb-6 border-b border-accent"> {/* Changed border-black/10 */}
          {item.companyLogo && (
            <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 relative rounded-lg overflow-hidden border border-accent/50 shadow-sm mb-4 sm:mb-0 sm:mr-6"> {/* Changed border-black/10 */}
              <Image
                src={urlFor(item.companyLogo).width(200).height(200).fit('contain').url()}
                alt={`${item.company} logo`}
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 text-text">{item.jobTitle}</h1> {/* Ensured text-text */}
            <p className="text-lg sm:text-xl text-text/80 mb-1"> {/* Changed text-black/80 */}
              {item.company} {item.location && <span className="text-base text-text/60">({item.location})</span>} {/* Changed text-black/60 */}
            </p>
            <p className="text-md text-text/60"> {/* Changed text-black/60 */}
              {item.startDate.replace('-', '/')} – {item.endDate.replace('-', '/')}
            </p>
          </div>
        </div>
        
        {item.description && (
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 text-text dark:prose-invert"> {/* Added text-text, dark:prose-invert */}
            <h2 className="text-xl font-semibold mb-3 text-text">Responsibilities & Achievements:</h2> {/* Ensured text-text for prose heading */}
            <PortableText value={item.description} />
          </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-accent"> {/* Changed border-black/10 */}
            <h3 className="text-lg font-semibold mb-2 text-text">Skills/Technologies Used:</h3> {/* Ensured text-text */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="bg-accent text-secondary px-3 py-1 rounded-full text-sm"> {/* Changed bg-gray-200 text-gray-700 */}
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
