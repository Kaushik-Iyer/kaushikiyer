// src/app/page.tsx
import Link from "next/link";
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { PortableText } from "@portabletext/react";
import { TravelMap, FPLScoreCard } from '@/app/components/ClientOnlyWrapper';
import { getProjects, getExperience, getEducation, getTestimonials, getPosts } from "@/lib/data";
import type { Project, Experience, Education, Testimonial, Post } from "@/lib/types";

export const revalidate = 60; // Revalidate every 60 seconds

// Define PortableText block types for rendering
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

// Helper to truncate Portable Text for preview
const truncatePortableText = (blocks: PortableTextBlock[], maxLength: number): PortableTextBlock[] => {
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
  // Get most recent items from JSON data
  const posts = getPosts();
  const projects = getProjects();
  const education = getEducation();
  const experience = getExperience();
  const testimonials = getTestimonials();

  const recentPost = posts[0] || null;
  const recentProject = projects[0] || null;
  const recentEducation = education[0] || null;
  const recentExperience = experience[0] || null;
  const recentTestimonial = testimonials[0] || null;

  const fplManagerId = 1361280; // User's FPL Manager ID

  return (
    <Layout>
      <div className="space-y-16 py-12">

        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-text">Hello, I&apos;m Kaushik Iyer.</h1>
          <p className="text-lg mb-2 text-text/90">CS Masters @ Cornell</p>
          <p className="text-lg mb-4 text-text/80">
            I&apos;m Kaushik Iyer, a Computer Science Masters student at Cornell University. Originally from Mumbai, I&apos;m currently based in Ithaca, NY. I&apos;m always eager to take on new challenges and contribute to innovative projects in the tech world.
          </p>
          <h2 className="text-3xl font-bold mb-3 text-text">Who am I?</h2>
          <p className="text-lg text-text/80">
            I&apos;m a software developer with a passion for backend and product development. When I&apos;m not coding, you&apos;ll find me watching soccer, exploring new cuisines, reading books, or exploring the beautiful gorges of Ithaca. I believe in building technology that makes a difference, whether it&apos;s through optimizing system performance or creating tools that bring value to users.
          </p>
        </section>

        {/* FPL Scorecard Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-text">My FPL Team Status</h2>
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
              <Link href={`/blog/${recentPost.slug}`} className="block group">
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
              <Link href={`/projects/${recentProject.slug}`} className="block group">
                {recentProject.mainImage && (
                  <div className="w-full h-48 relative overflow-hidden rounded-md mb-4">
                    <Image
                      src={recentProject.mainImage}
                      alt={recentProject.title}
                      fill
                      style={{ objectFit: 'cover' }}
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
              <Link href={`/education/${recentEducation.slug}`} className="block group">
                <div className="flex items-center space-x-4">
                  {recentEducation.institutionLogo && (
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden border border-accent/50">
                      <Image
                        src={recentEducation.institutionLogo}
                        alt={`${recentEducation.institution} logo`}
                        fill
                        style={{ objectFit: 'contain' }}
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
            </div>
            <div className="p-6 border border-accent rounded-lg shadow-lg bg-background">
              <Link href={`/experience/${recentExperience.slug}`} className="block group">
                <div className="flex items-center space-x-4">
                  {recentExperience.companyLogo && (
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden border border-accent/50">
                      <Image
                        src={recentExperience.companyLogo}
                        alt={`${recentExperience.company} logo`}
                        fill
                        style={{ objectFit: 'contain' }}
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
            <h2 className="text-2xl sm:text-3xl font-bold text-text">Places I&apos;ve Visited</h2>
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
              <Link href={`/testimonials/${recentTestimonial.slug}`} className="block group">
                <div className="flex items-center space-x-4">
                  {recentTestimonial.personImage && (
                    <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden border border-accent/50">
                      <Image
                        src={recentTestimonial.personImage}
                        alt={recentTestimonial.personName}
                        fill
                        style={{ objectFit: 'cover' }}
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