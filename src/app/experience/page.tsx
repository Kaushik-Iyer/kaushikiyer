// src/app/experience/page.tsx
import Link from "next/link";
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { getExperience } from "@/lib/data";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ExperiencePage() {
  const experienceItems = getExperience();

  return (
    <Layout>
      <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-text">Work Experience</h1>
      {experienceItems && experienceItems.length > 0 ? (
        <div className="space-y-8 max-w-3xl mx-auto">
          {experienceItems.map((item) => (
            <div key={item.id} className="p-6 border border-accent rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-background">
              <Link href={`/experience/${item.slug}`} className="block group">
                <div className="flex items-start space-x-4">
                  {item.companyLogo && (
                    <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden border border-accent/50">
                      <Image
                        src={item.companyLogo}
                        alt={`${item.company} logo`}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-1 group-hover:text-primary transition-colors duration-300 text-text">
                      {item.jobTitle}
                    </h2>
                    <p className="text-md text-text/80 mb-1">{item.company} {item.location && <span className="text-sm text-text/50">({item.location})</span>}</p>
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
        <p className="text-center text-text/70">No work experience found. Add some via the admin panel!</p>
      )}
    </Layout>
  );
}
