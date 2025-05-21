// src/app/projects/page.tsx
import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Layout from "@/app/components/layout/Layout";
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface Project extends SanityDocument {
  title: string;
  slug: { current: string };
  publishedAt: string;
  description?: string;
  mainImage?: any;
}

const PROJECTS_QUERY = `*[_type == "project" && defined(slug.current)]|order(publishedAt desc){
  _id, title, slug, publishedAt, description, mainImage
}`;

const revalidateOptions = { next: { revalidate: 60 } };

export default async function ProjectsPage() {
  const projects = await client.fetch<Project[]>(
    PROJECTS_QUERY,
    {},
    revalidateOptions
  );

  return (
    <Layout>
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-text">Projects</h1>
      {projects && projects.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <li key={project._id} className="border border-accent rounded-lg overflow-hidden group hover:shadow-lg transition-shadow duration-300 bg-background">
              <Link href={`/projects/${project.slug.current}`} className="block">
                {project.mainImage && (
                  <div className="w-full h-48 relative overflow-hidden">
                    <Image
                      src={urlFor(project.mainImage).width(400).height(300).fit('crop').url()}
                      alt={project.title}
                      layout="fill"
                      objectFit="cover"
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
        <p className="text-text/70">No projects found. Start by adding some in the Sanity Studio!</p>
      )}
    </Layout>
  );
}
