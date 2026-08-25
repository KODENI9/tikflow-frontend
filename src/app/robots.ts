import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/admin/'],
    },
    sitemap: 'https://tikflowaf.online/sitemap.xml',
  }
}
