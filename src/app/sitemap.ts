import { MetadataRoute } from 'next'
import { getListings, getCategories, getLocations } from '@/server/repo/repoMock'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-nostri.vercel.app'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/new`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    // Dynamic pages - listings
    const listingsResult = await getListings({ limit: 1000 })
    const listingPages: MetadataRoute.Sitemap = listingsResult.listings.map((listing) => ({
      url: `${baseUrl}/listing/${listing.slug || listing.id}`,
      lastModified: listing.updatedAt || listing.createdAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    // Category pages
    const categories = await getCategories()
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/?category=${category.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))

    // Location pages
    const locations = await getLocations()
    const locationPages: MetadataRoute.Sitemap = locations.map((location) => ({
      url: `${baseUrl}/?location=${location.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...listingPages, ...categoryPages, ...locationPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if dynamic generation fails
    return staticPages
  }
}
