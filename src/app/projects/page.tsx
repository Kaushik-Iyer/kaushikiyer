// src/app/projects/page.tsx
import Link from "next/link";
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { getProjects } from "@/lib/data";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProjectsPage() {
  const projects = getProjects();

  return (
    <Layout>
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-text">Projects</h1>
      {projects && projects.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <li key={project.id} className="border border-accent rounded-lg overflow-hidden group hover:shadow-lg transition-shadow duration-300 bg-background">
              <Link href={`/projects/${project.slug}`} className="block">
                {project.mainImage && (
                  <div className="w-full h-48 relative overflow-hidden">
                    <Image
                      src={project.mainImage}
                      alt={project.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-1 group-hover:text-primary transition-colors duration-300 text-text">
                    {project.title}
                  </h2>
                  {project.description && (
                    <p className="text-sm text-text/70 mb-2 line-clamp-3">
                      {project.description}
                    </p>
                  )}
                  <p className="text-xs text-text/60">
                    Published: {new Date(project.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-text/70">No projects found. Add some via the admin panel!</p>
      )}
    </Layout>
  );
}
