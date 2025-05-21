// src/app/projects/[slug]/page.tsx
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Layout from "@/app/components/layout/Layout";
import { PortableText } from "@portabletext/react";
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface Project extends SanityDocument {
  title: string;
  slug: { current: string };
  publishedAt: string;
  description?: string; // Assuming description might be portable text or simple text
  body?: any[]; // For more detailed content if you add a body field to project schema
  mainImage?: any;
  projectUrl?: string;
  tags?: string[];
}

const SINGLE_PROJECT_QUERY = `*[_type == "project" && slug.current == $slug][0]{
  _id, title, slug, publishedAt, description, body, mainImage, projectUrl, tags
}`;

export async function generateStaticParams() {
  const projectsData = await client.fetch<{ slug: string }[]>( // Ensure this matches the project schema
    `*[_type == "project" && defined(slug.current)]{ "slug": slug.current }`
  );
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

const revalidateOptions = { next: { revalidate: 60 } };

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await client.fetch<Project>(
    SINGLE_PROJECT_QUERY,
    { slug: params.slug },
    revalidateOptions
  );

  if (!project) {
    notFound();
  }

  return (
    <Layout>
      <article className="max-w-2xl mx-auto bg-background text-text p-6 rounded-lg shadow-xl border border-accent my-8"> {/* Added bg-background, text-text, border, padding, margin */}
        {project.mainImage && (
          <div className="mb-8 relative w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={urlFor(project.mainImage).width(800).height(600).fit('crop').url()}
              alt={project.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-center text-text">{project.title}</h1> {/* Ensured text-text */}
        <p className="text-sm text-text/70 mb-6 text-center"> {/* Changed text-black/60 */}
          Published on: {new Date(project.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {project.projectUrl && (
          <div className="mb-6 text-center">
            <a 
              href={project.projectUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/80 transition-colors duration-300 text-lg" // Changed bg-blue-600 to bg-primary
            >
              View Project
            </a>
          </div>
        )}

        {project.description && (
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none mb-8 text-center text-lg text-text/80 dark:prose-invert"> {/* Changed text-black/80, added dark:prose-invert */}
            {/* If description is simple text, wrap in <p>. If Portable Text, use <PortableText> */}
            <p>{project.description}</p>
            {/* Example for Portable Text description: <PortableText value={project.description} /> */}
          </div>
        )}
        
        {/* If you add a 'body' field (Portable Text) to your project schema for more detailed content */}
        {project.body && (
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert text-text"> {/* Added dark:prose-invert, text-text */}
            <PortableText value={project.body} />
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-accent"> {/* Changed border-black/10 */}
            <h3 className="text-lg font-semibold mb-2 text-text">Technologies Used:</h3> {/* Ensured text-text */}
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
