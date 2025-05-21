// src/sanity/schemaTypes/experience.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => `${doc.jobTitle}-${doc.company}`,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'companyLogo',
      title: 'Company Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date (or "Present")',
      type: 'string', // Using string to allow "Present"
      description: 'Enter YYYY-MM or type "Present"',
      validation: (Rule) => Rule.required(), 
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Responsibilities & Achievements',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Skills/Technologies Used',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      description: 'A string to help with ordering, e.g., "01", "02". Or use dates for ordering.',
      // hidden: true, // Optionally hide if you primarily use dates for ordering
    }),
  ],
  orderings: [
    {
      title: 'End Date, Newest First',
      name: 'endDateDesc',
      by: [{field: 'endDate', direction: 'desc'}],
    },
    {
      title: 'Order Rank',
      name: 'orderRankAsc',
      by: [{field: 'orderRank', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'jobTitle',
      subtitle: 'company',
      media: 'companyLogo',
    },
  },
})
