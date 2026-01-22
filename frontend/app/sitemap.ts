import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPostsAndPages = await sanityFetch({
    query: sitemapData,
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bodymetrics.ru' // или твой домен

  const sitemap: MetadataRoute.Sitemap = []

  sitemap.push({
    url: baseUrl,
    lastModified: new Date(),
    priority: 1.0,
    changeFrequency: 'weekly',
  })

  sitemap.push({
    url: `${baseUrl}/food`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'daily',
  })

  sitemap.push({
    url: `${baseUrl}/profile`,
    lastModified: new Date(),
    priority: 0.5,
    changeFrequency: 'weekly',
  })

  if (allPostsAndPages != null && allPostsAndPages.data.length !== 0) {
    for (const p of allPostsAndPages.data) {
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
          priority = 0.8
          changeFrequency = 'monthly'
          url = `${baseUrl}/${p.slug}`
          break
        case 'post':
          priority = 0.6
          changeFrequency = 'weekly'
          url = `${baseUrl}/posts/${p.slug}`
          break
        default:
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
