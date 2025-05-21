export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-05-21'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN
// No need for assertValue here if the token is optional for read operations,
// but for write operations, it will be essential.
// If you want to ensure it's set during build for some reason, you could assert it:
// export const token = assertValue(
//   process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN,
//  'Missing environment variable: NEXT_PUBLIC_SANITY_API_WRITE_TOKEN'
// )


function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
