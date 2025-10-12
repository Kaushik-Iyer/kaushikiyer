// src/lib/data.ts - Data fetching utilities
import fs from 'fs';
import path from 'path';
import type { Project, Experience, Education, Testimonial, Post, VisitedPlace, SiteSettings } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Generic function to read JSON data
function readJsonFile<T>(filename: string): T[] {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent) as T[];
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

// Generic function to write JSON data
export function writeJsonFile<T>(filename: string, data: T[]): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Projects
export function getProjects(): Project[] {
  const projects = readJsonFile<Project>('projects.json');
  return projects.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getProjectBySlug(slug: string): Project | null {
  const projects = getProjects();
  return projects.find(p => p.slug === slug) || null;
}

// Experience
export function getExperience(): Experience[] {
  const experience = readJsonFile<Experience>('experience.json');
  return experience.sort((a, b) => {
    // Sort by endDate (newest first), handle "Present"
    const dateA = a.endDate.toLowerCase() === 'present' ? new Date() : new Date(a.endDate);
    const dateB = b.endDate.toLowerCase() === 'present' ? new Date() : new Date(b.endDate);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getExperienceBySlug(slug: string): Experience | null {
  const experience = getExperience();
  return experience.find(e => e.slug === slug) || null;
}

// Education
export function getEducation(): Education[] {
  const education = readJsonFile<Education>('education.json');
  return education.sort((a, b) => {
    const dateA = a.endDate.toLowerCase() === 'present' ? new Date() : new Date(a.endDate);
    const dateB = b.endDate.toLowerCase() === 'present' ? new Date() : new Date(b.endDate);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getEducationBySlug(slug: string): Education | null {
  const education = getEducation();
  return education.find(e => e.slug === slug) || null;
}

// Testimonials
export function getTestimonials(): Testimonial[] {
  const testimonials = readJsonFile<Testimonial>('testimonials.json');
  return testimonials.sort((a, b) => {
    if (!a.testimonialDate || !b.testimonialDate) return 0;
    return new Date(b.testimonialDate).getTime() - new Date(a.testimonialDate).getTime();
  });
}

export function getTestimonialBySlug(slug: string): Testimonial | null {
  const testimonials = getTestimonials();
  return testimonials.find(t => t.slug === slug) || null;
}

// Blog Posts
export function getPosts(): Post[] {
  const posts = readJsonFile<Post>('posts.json');
  return posts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getPosts();
  return posts.find(p => p.slug === slug) || null;
}

export function getVisitedPlaces(): VisitedPlace[] {
  const places = readJsonFile<VisitedPlace>('visitedPlaces.json');
  return places.sort((a, b) => {
    if (!a.dateVisited) return 1;
    if (!b.dateVisited) return -1;
    return new Date(b.dateVisited).getTime() - new Date(a.dateVisited).getTime();
  });
}

export function getSiteSettings(): SiteSettings {
  const settings = readJsonFile<SiteSettings>('settings.json');
  return settings[0] || {
    id: 'site-settings',
    heroTitle: "Hello, I'm Kaushik Iyer.",
    heroSubtitle: "CS Masters @ Cornell",
    heroDescription: "Your description here",
    aboutTitle: "Who am I?",
    aboutDescription: "Your about section here",
    fplManagerId: 1361280
  };
}
