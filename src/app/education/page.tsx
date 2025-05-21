// src/app/education/page.tsx
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface EducationItem extends SanityDocument {
  degree: string;
  institution: string;
  slug: { current: string };
  startDate: string;
  endDate: string;
  institutionLogo?: any;
  description?: any[]; // Portable Text
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
      <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Education</h1>
      {educationItems && educationItems.length > 0 ? (
        <div className="space-y-8 max-w-2xl mx-auto">
          {educationItems.map((item) => (
            <div key={item._id} className="p-6 border border-black/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Link href={`/education/${item.slug.current}`} className="block group">
                <div className="flex items-start space-x-4">
                  {item.institutionLogo && (
                    <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden border border-black/5">
                      <Image
                        src={urlFor(item.institutionLogo).width(100).height(100).url()}
                        alt={`${item.institution} logo`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {item.degree}
                    </h2>
                    <p className="text-md text-black/80 mb-1">{item.institution}</p>
                    <p className="text-sm text-black/60">
                      {item.startDate.replace('-', '/')} – {item.endDate.replace('-', '/')}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-black/60">No education history found. Add some in the Sanity Studio!</p>
      )}
    </Layout>
  );
}
