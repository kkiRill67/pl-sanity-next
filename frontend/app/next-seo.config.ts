export const defaultSeoConfig = {
  titleTemplate: '%s | Body Metrics',
  defaultTitle: 'Body Metrics - Здоровье, Питание, Спорт',
  description: 'Body Metrics - ваш путеводитель в мире здорового питания, похудения, тренировок и спортивных показателей. Узнайте о ключевых параметрах тела и эффективных методах достижения целей.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bodymetrics.ru',
    site_name: 'Body Metrics',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Body Metrics - здоровье, питание, спорт',
      },
    ],
    article: {
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      section: 'Health',
    },
  },
  twitter: {
    handle: '@bodymetrics',
    site: '@bodymetrics',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'author',
      content: 'Body Metrics Team',
    },
    {
      name: 'keywords',
      content: 'здоровое питание, похудение, тренировки, спортивные показатели, фитнес, диета, здоровье, тело, метрики, BMI, вес, калории',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
    },
    {
      name: 'theme-color',
      content: '#00d4aa',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black-translucent',
    },
    // Yandex verification for bodymetrics.ru
    {
      name: 'yandex-verification',
      content: 'da9aca6a8acc81b3',
    },
    // Google verification (placeholder - update when you get it)
    {
      name: 'google-site-verification',
      content: 'YOUR_GOOGLE_VERIFICATION_CODE',
    },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};
