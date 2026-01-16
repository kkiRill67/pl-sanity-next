/**
 * Structured Data (Schema.org) helper for Body Metrics
 * This file provides JSON-LD markup for search engines
 */

interface StructuredDataProps {
  title: string;
  description: string;
  url: string;
  type?: 'WebSite' | 'Article' | 'Recipe' | 'Organization';
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  tags?: string[];
  publisher?: string;
}

export function getStructuredData({
  title,
  description,
  url,
  type = 'WebSite',
  image,
  publishedTime,
  modifiedTime,
  author,
  category,
  tags,
  publisher = 'Body Metrics',
}: StructuredDataProps): Record<string, unknown> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bodymetrics.ru';

  // Base structured data for all pages
  const baseData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    description: description,
    url: url || baseUrl,
    image: image || `${baseUrl}/images/og-image.jpg`,
    inLanguage: 'ru-RU',
    datePublished: publishedTime || new Date().toISOString(),
    dateModified: modifiedTime || new Date().toISOString(),
  };

  // Add type-specific properties
  switch (type) {
    case 'WebSite':
      baseData.potentialAction = {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      };
      break;

    case 'Article':
      if (author) {
        baseData.author = {
          '@type': 'Person',
          name: author,
        };
      }
      if (publisher) {
        baseData.publisher = {
          '@type': 'Organization',
          name: publisher,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/favicon.ico`,
            width: 64,
            height: 64,
          },
        };
      }
      if (category) {
        baseData.articleSection = category;
      }
      if (tags && tags.length > 0) {
        baseData.keywords = tags.join(', ');
      }
      break;

    case 'Recipe':
      baseData.recipeCategory = category || 'Healthy';
      baseData.recipeCuisine = 'Russian';
      if (author) {
        baseData.author = {
          '@type': 'Person',
          name: author,
        };
      }
      break;

    case 'Organization':
      baseData.logo = `${baseUrl}/favicon.ico`;
      baseData.sameAs = [
        'https://t.me/bodymetrics',
        'https://vk.com/bodymetrics',
      ];
      break;
  }

  return baseData;
}

// Pre-configured structured data for common use cases
export const organizationSchema = getStructuredData({
  title: 'Body Metrics',
  description: 'Body Metrics - ваш путеводитель в мире здорового питания, похудения, тренировок и спортивных показателей',
  url: 'https://bodymetrics.ru',
  type: 'Organization',
});

export const websiteSchema = getStructuredData({
  title: 'Body Metrics - Здоровье, Питание, Спорт',
  description: 'Body Metrics - ваш путеводитель в мире здорового питания, похудения, тренировок и спортивных показателей. Узнайте о ключевых параметрах тела и эффективных методах достижения целей.',
  url: 'https://bodymetrics.ru',
  type: 'WebSite',
});

/**
 * Generate JSON-LD string for embedding in HTML
 */
export function generateJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Get SEO structured data for blog posts/articles
 */
export function getArticleSchema({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
  category,
  tags,
}: Omit<StructuredDataProps, 'type'>): string {
  const data = getStructuredData({
    title,
    description,
    url,
    type: 'Article',
    image,
    publishedTime,
    modifiedTime,
    author,
    category,
    tags,
  });
  return generateJsonLd(data);
}

/**
 * Get SEO structured data for recipes
 */
export function getRecipeSchema({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  author,
  category,
}: Omit<StructuredDataProps, 'type' | 'tags'>): string {
  const data = getStructuredData({
    title,
    description,
    url,
    type: 'Recipe',
    image,
    publishedTime,
    modifiedTime,
    author,
    category,
  });
  return generateJsonLd(data);
}
