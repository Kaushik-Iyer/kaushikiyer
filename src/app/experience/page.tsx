// src/app/experience/page.tsx
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Layout from "@/app/components/layout/Layout";
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
}

const EXPERIENCE_QUERY = `*[_type == "experience"]|order(endDate desc, startDate desc){
  _id, jobTitle, company, slug, startDate, endDate, companyLogo, location
}`;

const revalidateOptions = { next: { revalidate: 60 } };

export default async function ExperiencePage() {
  const experienceItems = await client.fetch<ExperienceItem[]>(
    EXPERIENCE_QUERY,
    {},
    revalidateOptions
  );

  return (
    <Layout>
      <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Work Experience</h1>
      {experienceItems && experienceItems.length > 0 ? (
        <div className="space-y-8 max-w-3xl mx-auto">
          {experienceItems.map((item) => (
            <div key={item._id} className="p-6 border border-black/10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <Link href={`/experience/${item.slug.current}`} className="block group">
                <div className="flex items-start space-x-4">
                  {item.companyLogo && (
                    <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden border border-black/5">
                      <Image
                        src={urlFor(item.companyLogo).width(100).height(100).fit('contain').url()}
                        alt={`${item.company} logo`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {item.jobTitle}
                    </h2>
                    <p className="text-md text-black/80 mb-1">{item.company} {item.location && <span className="text-sm text-black/50">({item.location})</span>}</p>
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
        <p className="text-center text-black/60">No work experience found. Add some in the Sanity Studio!</p>
      )}
    </Layout>
  );
}
