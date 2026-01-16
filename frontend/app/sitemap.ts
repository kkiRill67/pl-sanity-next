import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'
import {headers} from 'next/headers'

/**
 * Sitemap for Body Metrics - optimized for search engines
 * Priority values: 1.0 (most important), 0.8 (important pages), 0.5 (regular content), 0.3 (less important)
 * Change frequency: based on content update schedule
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPostsAndPages = await sanityFetch({
    query: sitemapData,
  })
  const headersList = await headers()
  const sitemap: MetadataRoute.Sitemap = []
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${headersList.get('host')}`
  
  // Main pages with high priority
  sitemap.push({
    url: baseUrl,
    lastModified: new Date(),
    priority: 1.0,
    changeFrequency: 'weekly',
  })
  
  // Food/Recipes section - important for health/nutrition
  sitemap.push({
    url: `${baseUrl}/food`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'daily',
  })
  
  // Profile section
  sitemap.push({
    url: `${baseUrl}/profile`,
    lastModified: new Date(),
    priority: 0.5,
    changeFrequency: 'weekly',
  })
  
  // Add dynamic content from Sanity
  if (allPostsAndPages != null && allPostsAndPages.data.length != 0) {
    for (const p of allPostsAndPages.data) {
      // Type guard to ensure p has the required properties
      if (!p._type || !p.slug) continue
      
      let priority: number
      let changeFrequency:
        | 'monthly'
        | 'always'
        | 'hourly'
        | 'daily'
        | 'weekly'
        | 'yearly'
        | 'never'
        | undefined
      let url: string

      switch (p._type) {
        case 'page':
          // Static pages (about, contact, etc.)
          priority = 0.8
          changeFrequency = 'monthly'
          url = `${baseUrl}/${p.slug}`
          break
        case 'post':
          // Blog posts about health, nutrition, fitness
          priority = 0.6
          changeFrequency = 'weekly' // Changed from 'never' - health content gets updated
          url = `${baseUrl}/posts/${p.slug}`
          break
        default:
          // Skip unknown types
          continue
      }
      
      sitemap.push({
        lastModified: p._updatedAt || new Date(),
        priority,
        changeFrequency,
        url,
      })
    }
  }

  return sitemap
}
