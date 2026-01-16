import { Suspense } from 'react'

import { AllPosts } from '@/shared/components/Posts'
// import { Menu } from '@/widgets/menu'

export default async function Food() {
  return (
    <div className="space-y-8">
      {/* <Menu /> */}
      <aside>
        <Suspense>{await AllPosts()}</Suspense>
      </aside>
    </div>
  )
}
