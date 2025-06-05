import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'suggestion',
  title: 'Suggestion',
  type: 'document',
  // Note: To allow creation of 'suggestion' documents via the API (e.g., from a frontend form),
  // the Sanity client token used must have 'create' permissions for this document type.
  // This is configured in your Sanity project's access control settings.
  fields: [
    defineField({
      name: 'text',
      title: 'Suggestion Content',
      type: 'text',
      description: 'The content of the suggestion submitted by a user.',
      validation: (Rule) => Rule.required().min(10).max(5000),
    }),
    defineField({
      name: 'userName',
      title: 'User Name (Optional)',
      type: 'string',
      description: 'Name of the person submitting the suggestion (if provided).',
    }),
    defineField({
      name: 'userEmail',
      title: 'User Email (Optional)',
      type: 'string',
      description: 'Email of the person submitting the suggestion (if provided, for follow-up).',
      validation: (Rule) =>
        Rule.custom((email: string | undefined) => {
          if (email && email.length > 0 && !/.+@.+\..+/.test(email)) {
            return 'Please enter a valid email address.'
          }
          return true
        }),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
      },
      initialValue: () => new Date().toISOString(),
      readOnly: true, // Automatically set and not editable
    }),
    // Optional: You could add a field to mark if a suggestion has been reviewed
    defineField({
      name: 'isReviewed',
      title: 'Reviewed',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'text',
      subtitle: 'submittedAt',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      const formattedDate = subtitle ? new Date(subtitle).toLocaleString() : 'No date'
      return {
        title: title ? (title.length > 50 ? title.slice(0, 50) + '...' : title) : 'Untitled Suggestion',
        subtitle: `Submitted: ${formattedDate}`,
      }
    },
  },
  orderings: [
    {
      title: 'Submission Date, Newest First',
      name: 'submittedAtDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
  ],
})
