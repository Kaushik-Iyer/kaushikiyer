import { type SchemaTypeDefinition } from 'sanity'
import project from './project'
import post from './post'
import education from './education'
import experience from './experience'
import testimonial from './testimonial'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, post, education, experience, testimonial],
}
