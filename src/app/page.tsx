// src/app/page.tsx
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client"; 
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from "@portabletext/react";
import TravelMap from "@/app/components/TravelMap"; 
import FPLScoreCard from "@/app/components/FPLScoreCard"; // Added import

// Interface definitions (can be moved to a types file later)
interface Post extends SanityDocument {
  title: string;
  slug: { current: string };
  publishedAt: string;
  body?: any[]; 
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
  const fplManagerId = 154063; // User's FPL Manager ID

  return (
    <Layout>
      <div className="space-y-16 py-12">

        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-text">Hello, I’m Kaushik Iyer.</h1>
          <p className="text-lg mb-2 text-text/90">CS Masters @ Cornell</p>
          <p className="text-lg mb-4 text-text/80">
            I'm Kaushik Iyer, a Computer Science Masters student at Cornell University. Originally from Mumbai, I'm currently based in Ithaca, NY. I'm always eager to take on new challenges and contribute to innovative projects in the tech world.
          </p>
          <h2 className="text-3xl font-bold mb-3 text-text">Who am I?</h2>
          <p className="text-lg text-text/80">
            I'm a software developer with a passion for backend and product development. When I'm not coding, you'll find me watching soccer, exploring new cuisines, reading books, or exploring the beautiful gorges of Ithaca. I believe in building technology that makes a difference, whether it's through optimizing system performance or creating tools that bring value to users.
          </p>
        </section>

        {/* FPL Scorecard Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-text">My FPL Team Status</h2>
            {/* Optional: Add a link to official FPL site or manager's page */}
          </div>
          <FPLScoreCard managerId={fplManagerId} />
        </section>

        {/* Blog Section */}
        {recentPost && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-text">Latest Blog Post</h2>
              <Link href="/blog" className="text-primary hover:text-primary/80 hover:underline"> {/* Updated href to /blog */}
                View All Posts &rarr;
              </Link>
            </div>
            <div className="p-6 border border-accent rounded-lg shadow-lg bg-background">
              <Link href={`/${recentPost.slug.current}`} className="block group">
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 group-hover:text-primary text-text">{recentPost.title}</h3>
                {recentPost.body && (
                  <div className="prose prose-sm max-w-none text-text/70 line-clamp-3 mb-3 dark:prose-invert">
                     <PortableText value={truncatePortableText(recentPost.body, 150)} />
                  </div>
                )}
                <p className="text-sm text-text/60">
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
              <h2 className="text-2xl sm:text-3xl font-bold text-text">Latest Project</h2>
              <Link href="/projects" className="text-primary hover:text-primary/80 hover:underline">
                View All Projects &rarr;
              </Link>
            </div>
            <div className="p-6 border border-accent rounded-lg shadow-lg bg-background">
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
                <h3 className="text-xl sm:text-2xl font-semibold mb-1 group-hover:text-primary text-text">{recentProject.title}</h3>
                {recentProject.description && (
                  <p className="text-text/70 line-clamp-2">{recentProject.description}</p>
                )}
              </Link>
            </div>
          </section>
        )}

        {/* Education Section */}
        {recentEducation && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-text">Recent Education</h2>
              <Link href="/education" className="text-primary hover:text-primary/80 hover:underline">
                View All Education &rarr;
              </Link>
            </div>
            <div className="p-6 border border-accent rounded-lg shadow-lg bg-background">
              <Link href={`/education/${recentEducation.slug.current}`} className="block group">
                <div className="flex items-center space-x-4">
                  {recentEducation.institutionLogo && (
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden border border-accent/50">
                      <Image
                        src={urlFor(recentEducation.institutionLogo).width(100).height(100).url()}
                        alt={`${recentEducation.institution} logo`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold group-hover:text-primary text-text">{recentEducation.degree}</h3>
                    <p className="text-text/80">{recentEducation.institution}</p>
                    <p className="text-sm text-text/60">Ended: {new Date(recentEducation.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
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
              <h2 className="text-2xl sm:text-3xl font-bold text-text">Recent Experience</h2>
              <Link href="/experience" className="text-primary hover:text-primary/80 hover:underline">
                View All Experience &rarr;
              </Link>
            </div>
            <div className="p-6 border border-accent rounded-lg shadow-lg bg-background">
              <Link href={`/experience/${recentExperience.slug.current}`} className="block group">
                <div className="flex items-center space-x-4">
                  {recentExperience.companyLogo && (
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden border border-accent/50">
                      <Image
                        src={urlFor(recentExperience.companyLogo).width(100).height(100).url()}
                        alt={`${recentExperience.company} logo`}
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-1 group-hover:text-primary text-text">{recentExperience.jobTitle}</h3>
                    <p className="text-text/80">{recentExperience.company}</p>
                    <p className="text-sm text-text/60">Ended: {new Date(recentExperience.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Travel Map Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-text">Places I've Visited</h2>
          </div>
          <div className="p-6 border border-accent rounded-lg shadow-lg bg-background">
            <TravelMap />
          </div>
        </section>

        {/* Testimonials Section */}
        {recentTestimonial && (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-text">What People Say</h2>
              <Link href="/#testimonials" className="text-primary hover:text-primary/80 hover:underline">
                View All Testimonials &rarr;
              </Link>
            </div>
            <div className="p-6 border border-accent rounded-lg shadow-lg bg-background">
              <Link href={`/testimonials/${recentTestimonial.slug.current}`} className="block group">
                <div className="flex items-center space-x-4">
                  {recentTestimonial.personImage && (
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden border border-accent/50">
                      <Image
                        src={urlFor(recentTestimonial.personImage).width(100).height(100).url()}
                        alt={recentTestimonial.personName}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-1 group-hover:text-primary text-text">{recentTestimonial.personName}</h3>
                    {recentTestimonial.relation && (
                      <p className="text-sm text-text/60">{recentTestimonial.relation}</p>
                    )}
                    <div className="prose prose-sm max-w-none text-text/70 mt-2 dark:prose-invert">
                      <PortableText value={recentTestimonial.testimonialContent} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}