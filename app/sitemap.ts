import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

    const formatDate = (date: Date): string => {
        return date.toISOString();
    }

    const home = {
        url: 'https://vaclaims-academy.com/',
        lastModified: formatDate(new Date()),
    }

    const urls = [
        {
            url: 'https://vaclaims-academy.com/login',
            lastModified: formatDate(new Date()),
        },
        {
            url: 'https://vaclaims-academy.com/va-disability-calculator',
            lastModified: formatDate(new Date()),
        },
        {
            url: 'https://vaclaims-academy.com/about-us',
            lastModified: formatDate(new Date()),
        },
        {
            url: 'https://vaclaims-academy.com/testimonials',
            lastModified: formatDate(new Date()),
        },
        {
            url: 'https://vaclaims-academy.com/blog',
            lastModified: formatDate(new Date()),
        }
    ]
    
    return [home, ...urls]
}