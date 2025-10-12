// src/lib/types.ts - Centralized type definitions

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  projectUrl?: string;
  tags?: string[];
  mainImage?: string;
  publishedAt: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  slug: string;
  companyLogo?: string;
  startDate: string;
  endDate: string;
  location?: string;
  description: any[]; // Portable Text blocks
  tags?: string[];
  orderRank?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  slug: string;
  institutionLogo?: string;
  startDate: string;
  endDate: string;
  description?: any[]; // Portable Text blocks
  orderRank?: string;
}

export interface Testimonial {
  id: string;
  personName: string;
  relation?: string;
  testimonialContent: any[]; // Portable Text blocks
  slug: string;
  personImage?: string;
  testimonialDate?: string;
  orderRank?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  mainImage?: string;
  publishedAt: string;
  body: any[]; // Portable Text blocks
}

export interface VisitedPlace {
  id: string;
  countryName: string;
  countryCode: string; // ISO A2 code (e.g., "US", "JP")
  city?: string;
  dateVisited?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  cityImage?: string; // Path to image from that city
}

export interface SiteSettings {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  fplManagerId?: number;
}

export interface Suggestion {
  id: string;
  text: string;
  userName?: string;
  userEmail?: string;
  submittedAt: string;
  isReviewed?: boolean;
  reviewedAt?: string;
}
