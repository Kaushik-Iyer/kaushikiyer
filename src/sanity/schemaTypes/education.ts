// src/sanity/schemaTypes/education.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({
      name: 'degree',
      title: 'Degree',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'institution',
      title: 'Institution',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => `${doc.degree}-${doc.institution}`,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'institutionLogo',
      title: 'Institution Logo',
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
      name: 'description',
      title: 'Description/Achievements',
      type: 'array',
      of: [{type: 'block'}],
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
      title: 'degree',
      subtitle: 'institution',
      media: 'institutionLogo',
    },
  },
})
