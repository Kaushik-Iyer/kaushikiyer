// src/app/education/page.tsx
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Layout from "@/app/components/layout/Layout";
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

interface EducationItem extends SanityDocument {
  degree: string;
  institution: string;
  slug: { current: string };
  startDate: string;
  endDate: string;
  institutionLogo?: SanityImage;
  description?: PortableTextBlock[];
}

const EDUCATION_QUERY = `*[_type == "education"]|order(endDate desc, startDate desc){
  _id, degree, institution, slug, startDate, endDate, institutionLogo, description
}`;

const revalidateOptions = { next: { revalidate: 60 } };

export default async function EducationPage() {
  const educationItems = await client.fetch<EducationItem[]>(
    EDUCATION_QUERY,
    {},
    revalidateOptions
  );

  return (
    <Layout>
      <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-text">Education</h1>
      {educationItems && educationItems.length > 0 ? (
        <div className="space-y-8 max-w-2xl mx-auto">
          {educationItems.map((item) => (
            <div key={item._id} className="p-6 border border-accent rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-background">
              <Link href={`/education/${item.slug.current}`} className="block group">
                <div className="flex items-start space-x-4">
                  {item.institutionLogo && (
                    <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden border border-accent/50">
                      <Image
                        src={urlFor(item.institutionLogo).width(100).height(100).url()}
                        alt={`${item.institution} logo`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-1 group-hover:text-primary transition-colors duration-300 text-text">
                      {item.degree}
                    </h2>
                    <p className="text-md text-text/80 mb-1">{item.institution}</p>
                    <p className="text-sm text-text/60">
                      {item.startDate.replace('-', '/')} – {item.endDate.replace('-', '/')}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-text/70">No education history found. Add some in the Sanity Studio!</p>
      )}
    </Layout>
  );
}
