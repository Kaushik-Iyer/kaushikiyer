// src/sanity/schemaTypes/visitedPlace.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'visitedPlace',
  title: 'Visited Place',
  type: 'document',
  fields: [
    defineField({
      name: 'countryName',
      title: 'Country Name',
      type: 'string',
      description: 'The full name of the country (e.g., "Japan", "Brazil").',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'countryCode', // ISO 3166-1 alpha-2 or alpha-3 codes are common for maps
      title: 'Country Code (ISO A2)',
      type: 'string',
      description: 'Two-letter country code (e.g., "JP", "BR"). Important for mapping. You can find these online.',
      validation: (Rule) => Rule.required().length(2).uppercase(),
    }),
    defineField({
      name: 'city',
      title: 'City / Region',
      type: 'string',
      description: 'Specific city or region visited (optional).',
    }),
    defineField({
      name: 'dateVisited',
      title: 'Date Visited',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    }),
    defineField({
      name: 'notes',
      title: 'Notes / Highlights',
      type: 'text',
      description: 'Brief notes or highlights about the visit (optional).',
    }),
    // Optional: Add a slug if you plan to have detail pages for each visited place
    // defineField({
    //   name: 'slug',
    //   title: 'Slug',
    //   type: 'slug',
    //   options: {
    //     source: (doc) => `${doc.countryName}-${doc.city || ''}`,
    //     maxLength: 96,
    //   },
    // }),
  ],
  preview: {
    select: {
      title: 'countryName',
      subtitle: 'city',
      // media: 'someImageFieldIfYouAddOne' // if you add an image field
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title,
        subtitle: subtitle ? `${subtitle}` : '',
      }
    },
  },
  orderings: [
    {
      title: 'Date Visited, Newest First',
      name: 'dateVisitedDesc',
      by: [{field: 'dateVisited', direction: 'desc'}],
    },
    {
      title: 'Country Name, Ascending',
      name: 'countryNameAsc',
      by: [{field: 'countryName', direction: 'asc'}],
    },
  ],
})
