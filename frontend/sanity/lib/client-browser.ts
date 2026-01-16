'use client'

import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '@/sanity/lib/api'

/**
 * Client for browser-side usage (doesn't include server-only dependencies like token)
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  // No token for browser client - will only work with public data
})








