import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, token } from '../env' // Add token here

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token: token, // Use the imported token
})
