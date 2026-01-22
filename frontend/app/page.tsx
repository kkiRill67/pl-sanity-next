import { Suspense } from 'react'

import { AllPosts } from '@/shared/components/Posts'
import { websiteSchema } from '@/app/structured-data'
import { CategorySliderServer } from '@/shared/components/CategorySliderServer'

export default async function Page() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="container"> */}
      <aside>
        <CategorySliderServer />
        <Suspense>{await AllPosts()}</Suspense>
      </aside>
      {/* </main>
      </div> */}
    </>
  )
}
