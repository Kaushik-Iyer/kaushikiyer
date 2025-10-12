// src/app/page.tsx
import Link from "next/link";
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { TravelMap, FPLScoreCard } from '@/app/components/ClientOnlyWrapper';
import { getProjects, getExperience, getEducation, getTestimonials, getPosts, getSiteSettings } from "@/lib/data";
import type { Project, Experience, Education, Testimonial, Post } from "@/lib/types";

export const revalidate = 60; // Revalidate every 60 seconds

// Helper to truncate text from portable text blocks
const truncateText = (blocks: any[] = [], maxLength: number): string => {
  if (!blocks || !Array.isArray(blocks)) return '';
  let text = '';
  for (const block of blocks) {
    if (block._type === 'block' && block.children) {
      for (const span of block.children) {
        if (span.text) {
          text += span.text;
          if (text.length >= maxLength) {
            return text.substring(0, maxLength) + '...';
          }
        }
      }
    }
  }
  return text;
};


export default async function HomePage() {
  // Get most recent items from JSON data
  const posts = getPosts();
  const projects = getProjects();
  const education = getEducation();
  const experience = getExperience();
  const testimonials = getTestimonials();
  const siteSettings = getSiteSettings();

  const recentPost = posts[0] || null;
  const recentProject = projects[0] || null;
  const recentEducation = education[0] || null;
  const recentExperience = experience[0] || null;
  const recentTestimonial = testimonials[0] || null;

  const fplManagerId = siteSettings.fplManagerId || 1361280;

  return (
    <Layout>
      <div className="space-y-16 py-12">

        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-text">{siteSettings.heroTitle}</h1>
          <p className="text-lg mb-2 text-text/90">{siteSettings.heroSubtitle}</p>
          <p className="text-lg mb-4 text-text/80">
            {siteSettings.heroDescription}
          </p>
          <h2 className="text-3xl font-bold mb-3 text-text">{siteSettings.aboutTitle}</h2>
          <p className="text-lg text-text/80">
            {siteSettings.aboutDescription}
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
                     <p>{truncateText(recentPost.body, 150)}</p>
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
                      <p>{truncateText(recentTestimonial.testimonialContent, 300)}</p>
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