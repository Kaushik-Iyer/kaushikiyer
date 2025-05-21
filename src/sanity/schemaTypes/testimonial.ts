// src/sanity/schemaTypes/testimonial.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'personName', // Changed from authorName
      title: 'Person Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relation', // Changed from authorRole
      title: 'Relation to You',
      type: 'string',
      description: "e.g., 'Co-founder at Skima', 'Former Manager', 'Client'",
    }),
    defineField({
      name: 'testimonialContent', // Changed from quote, now Portable Text
      title: 'Testimonial Content',
      type: 'array', // For Portable Text
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [], // No lists needed for a simple testimonial block
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
            annotations: [ // Links might be useful
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => `${doc.personName}-${doc.relation || 'testimonial'}`.slice(0, 95), // Updated source
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'personImage', // Changed from authorImage
      title: 'Person Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'testimonialDate', // Changed from dateReceived
      title: 'Testimonial Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      description: 'A string to help with ordering, e.g., "01", "02". Optional.',
    }),
  ],
  orderings: [
    {
      title: 'Testimonial Date, Newest First', // Updated title
      name: 'testimonialDateDesc', // Updated name
      by: [{field: 'testimonialDate', direction: 'desc'}], // Updated field
    },
    {
      title: 'Order Rank',
      name: 'orderRankAsc',
      by: [{field: 'orderRank', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'personName', // Changed from quote to personName for a more identifiable preview title
      subtitle: 'relation', // Changed from authorName to relation
      media: 'personImage', // Changed from authorImage
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title,
        subtitle: subtitle || 'Testimonial',
        media: media,
      }
    },
  },
})
