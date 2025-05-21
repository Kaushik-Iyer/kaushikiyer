import { type SchemaTypeDefinition } from 'sanity'
import project from './project'
import post from './post'
import education from './education'
import experience from './experience'
import testimonial from './testimonial'
import visitedPlace from './visitedPlace' // Import the new schema
import suggestion from './suggestion' // Import the new suggestion schema

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, post, education, experience, testimonial, visitedPlace, suggestion], // Add suggestion to the array
}
