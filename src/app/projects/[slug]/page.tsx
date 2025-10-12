// src/app/projects/[slug]/page.tsx
import Layout from "@/app/components/layout/Layout";
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProjects, getProjectBySlug } from '@/lib/data';

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Type for params in Next.js 15
type Params = Promise<{ slug: string }>

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <Layout>
      <article className="max-w-2xl mx-auto bg-background text-text p-6 rounded-lg shadow-xl border border-accent my-8">
        {project.mainImage && (
          <div className="mb-8 relative w-full h-64 sm:h-96 overflow-hidden rounded-lg shadow-lg">
            <Image
              src={project.mainImage}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-center text-text">{project.title}</h1>
        <p className="text-sm text-text/70 mb-6 text-center">
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
              className="inline-block bg-primary text-white py-2 px-6 rounded-lg hover:bg-primary/80 transition-colors duration-300 text-lg"
            >
              View Project
            </a>
          </div>
        )}

        {project.description && (
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none mb-8 text-center text-lg text-text/80 dark:prose-invert">
            <p>{project.description}</p>
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-accent">
            <h3 className="text-lg font-semibold mb-2 text-text">Technologies Used:</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="bg-accent text-secondary px-3 py-1 rounded-full text-sm">
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
