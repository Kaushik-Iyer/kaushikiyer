// src/app/education/page.tsx
import Link from "next/link";
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { getEducation } from '@/lib/data';
import type { Education } from '@/lib/types';

export default async function EducationPage() {
  const educationItems = getEducation();

  return (
    <Layout>
      <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-text">Education</h1>
      {educationItems && educationItems.length > 0 ? (
        <div className="space-y-8 max-w-2xl mx-auto">
          {educationItems.map((item) => (
            <div key={item.id} className="p-6 border border-accent rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-background">
              <Link href={`/education/${item.slug}`} className="block group">
                <div className="flex items-start space-x-4">
                  {item.institutionLogo && (
                    <div className="flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden border border-accent/50">
                      <Image
                        src={item.institutionLogo}
                        alt={`${item.institution} logo`}
                        fill
                        className="object-contain"
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
        <p className="text-center text-text/70">No education history found.</p>
      )}
    </Layout>
  );
}
