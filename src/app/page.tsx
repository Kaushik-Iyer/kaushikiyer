// src/app/page.tsx
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client"; // Uses the alias for src/sanity/lib/client.ts
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from "@portabletext/react";

// Interface definitions (can be moved to a types file later)
interface Post extends SanityDocument {
  title: string;
  slug: { current: string };
  publishedAt: string;
  body?: any[]; // For a short excerpt
}

interface Project extends SanityDocument {
  title: string;
  slug: { current: string };
  description?: string;
  mainImage?: any;
}

interface EducationItem extends SanityDocument {
  degree: string;
  institution: string;
  slug: { current: string };
  endDate: string;
  institutionLogo?: any;
}

interface ExperienceItem extends SanityDocument {
  jobTitle: string;
  company: string;
  slug: { current: string };
  endDate: string;
  companyLogo?: any;
}

interface Testimonial extends SanityDocument {
  personName: string;
  relation?: string;
  testimonialContent: any[];
  slug: { current: string };
  personImage?: any;
}

// Queries for the most recent item of each type
const RECENT_POST_QUERY = `*[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0]{
  _id, title, slug, publishedAt, body
}`;
const RECENT_PROJECT_QUERY = `*[_type == "project" && defined(slug.current)]|order(publishedAt desc)[0]{
  _id, title, slug, description, mainImage
}`;
const RECENT_EDUCATION_QUERY = `*[_type == "education" && defined(slug.current)]|order(endDate desc, _createdAt desc)[0]{
  _id, degree, institution, slug, endDate, institutionLogo
}`;
const RECENT_EXPERIENCE_QUERY = `*[_type == "experience" && defined(slug.current)]|order(endDate desc, _createdAt desc)[0]{
  _id, jobTitle, company, slug, endDate, companyLogo
}`;
const RECENT_TESTIMONIAL_QUERY = `*[_type == "testimonial" && defined(slug.current)]|order(testimonialDate desc, _createdAt desc)[0]{
  _id, personName, relation, testimonialContent, slug, personImage
}`;

const revalidateOptions = { next: { revalidate: 60 } };

// Helper to truncate Portable Text for preview
const truncatePortableText = (blocks: any[], maxLength: number) => {
  if (!blocks || !Array.isArray(blocks)) return [];
  let currentLength = 0;
  const truncatedBlocks = [];
  for (const block of blocks) {
    if (block._type === 'block' && block.children) {
      const newChildren = [];
      for (const span of block.children) {
        if (span._type === 'span' && span.text) {
          if (currentLength + span.text.length > maxLength) {
            const remainingLength = maxLength - currentLength;
            if (remainingLength <= 0) {
                 newChildren.push({ ...span, text: '...' });
                 currentLength = maxLength;
                 break; // break from inner loop
            }
            newChildren.push({ ...span, text: span.text.substring(0, remainingLength) + '...' });
            currentLength += remainingLength;
            break; // break from inner loop
          }
          newChildren.push(span);
          currentLength += span.text.length;
        } else {
          newChildren.push(span);
        }
      }
      truncatedBlocks.push({ ...block, children: newChildren });
      if (currentLength >= maxLength) break; // break from outer loop
    } else {
      truncatedBlocks.push(block); // Push non-block elements as is
    }
  }
  return truncatedBlocks;
};


export default async function HomePage() {
  const [
    recentPost,
    recentProject,
    recentEducation,
    recentExperience,
    recentTestimonial
  ] = await Promise.all([
    client.fetch<Post | null>(RECENT_POST_QUERY, {}, revalidateOptions),
    client.fetch<Project | null>(RECENT_PROJECT_QUERY, {}, revalidateOptions),
    client.fetch<EducationItem | null>(RECENT_EDUCATION_QUERY, {}, revalidateOptions),
    client.fetch<ExperienceItem | null>(RECENT_EXPERIENCE_QUERY, {}, revalidateOptions),
    client.fetch<Testimonial | null>(RECENT_TESTIMONIAL_QUERY, {}, revalidateOptions),
  ]);

  return (
    <Layout>
      <div className="space-y-16 py-12">

        {/* Blog Section */}
        {recentPost && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Latest Blog Post</h2>
              <Link href="/#blog" className="text-blue-600 hover:text-blue-800 hover:underline">
                View All Posts &rarr;
              </Link>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
              <Link href={`/${recentPost.slug.current}`} className="block group">
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 group-hover:text-blue-700">{recentPost.title}</h3>
                {recentPost.body && (
                  <div className="prose prose-sm max-w-none text-gray-600 line-clamp-3 mb-3">
                     <PortableText value={truncatePortableText(recentPost.body, 150)} />
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  {new Date(recentPost.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </Link>
            </div>
          </section>
        )}

        {/* Projects Section */}
        {recentProject && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Latest Project</h2>
              <Link href="/projects" className="text-blue-600 hover:text-blue-800 hover:underline">
                View All Projects &rarr;
              </Link>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
              <Link href={`/projects/${recentProject.slug.current}`} className="block group">
                {recentProject.mainImage && (
                  <div className="w-full h-48 relative overflow-hidden rounded-md mb-4">
                    <Image
                      src={urlFor(recentProject.mainImage).width(400).height(300).fit('crop').url()}
                      alt={recentProject.title}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <h3 className="text-xl sm:text-2xl font-semibold mb-1 group-hover:text-blue-700">{recentProject.title}</h3>
                {recentProject.description && (
                  <p className="text-gray-600 line-clamp-2">{recentProject.description}</p>
                )}
              </Link>
            </div>
          </section>
        )}

        {/* Education Section */}
        {recentEducation && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Recent Education</h2>
              <Link href="/education" className="text-blue-600 hover:text-blue-800 hover:underline">
                View All Education &rarr;
              </Link>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
              <Link href={`/education/${recentEducation.slug.current}`} className="block group">
                <div className="flex items-center space-x-4">
                  {recentEducation.institutionLogo && (
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden border border-gray-100">
                      <Image
                        src={urlFor(recentEducation.institutionLogo).width(100).height(100).url()}
                        alt={`${recentEducation.institution} logo`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold group-hover:text-blue-700">{recentEducation.degree}</h3>
                    <p className="text-gray-700">{recentEducation.institution}</p>
                    <p className="text-sm text-gray-500">Ended: {new Date(recentEducation.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {recentExperience && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Recent Experience</h2>
              <Link href="/experience" className="text-blue-600 hover:text-blue-800 hover:underline">
                View All Experience &rarr;
              </Link>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
              <Link href={`/experience/${recentExperience.slug.current}`} className="block group">
                <div className="flex items-center space-x-4">
                  {recentExperience.companyLogo && (
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden border border-gray-100">
                      <Image
                        src={urlFor(recentExperience.companyLogo).width(100).height(100).url()}
                        alt={`${recentExperience.company} logo`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold group-hover:text-blue-700">{recentExperience.jobTitle}</h3>
                    <p className="text-gray-700">{recentExperience.company}</p>
                     <p className="text-sm text-gray-500">Ended: {new Date(recentExperience.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {recentTestimonial && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Recent Testimonial</h2>
              <Link href="/testimonials" className="text-blue-600 hover:text-blue-800 hover:underline">
                View All Testimonials &rarr;
              </Link>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
              <Link href={`/testimonials/${recentTestimonial.slug.current}`} className="block group">
                <div className="flex items-start space-x-4">
                    {recentTestimonial.personImage && (
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-full overflow-hidden border border-gray-100">
                        <Image
                        src={urlFor(recentTestimonial.personImage).width(100).height(100).fit('crop').url()}
                        alt={recentTestimonial.personName}
                        layout="fill"
                        objectFit="cover"
                        />
                    </div>
                    )}
                    <div className="flex-grow">
                        <h3 className="text-xl font-semibold group-hover:text-blue-700">{recentTestimonial.personName}</h3>
                        {recentTestimonial.relation && <p className="text-sm text-gray-600 mb-2">{recentTestimonial.relation}</p>}
                        <div className="prose prose-sm max-w-none text-gray-700 line-clamp-3">
                            <PortableText value={truncatePortableText(recentTestimonial.testimonialContent, 150)} />
                        </div>
                    </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {!recentPost && !recentProject && !recentEducation && !recentExperience && !recentTestimonial && (
          <p className="text-center text-xl text-gray-500 py-12">
            No content found. Start by adding some entries in the Sanity Studio!
          </p>
        )}
      </div>
    </Layout>
  );
}