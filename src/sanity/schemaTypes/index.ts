import { type SchemaTypeDefinition } from 'sanity'
import project from './project'
import post from './post'
import education from './education'
import experience from './experience'
import testimonial from './testimonial'
import visitedPlace from './visitedPlace' // Import the new schema

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, post, education, experience, testimonial, visitedPlace], // Add visitedPlace to the array
}
