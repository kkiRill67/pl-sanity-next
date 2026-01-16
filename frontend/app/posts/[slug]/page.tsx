import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { PortableText, type PortableTextBlock } from 'next-sanity'
import { Suspense } from 'react'

import { sanityFetch } from '@/sanity/lib/live'
import { postPagesSlugs, postQuery } from '@/sanity/lib/queries'
import { resolveOpenGraphImage } from '@/sanity/lib/utils'
import { MorePosts } from '@/shared/components/Posts'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: postPagesSlugs,
    perspective: 'published',
    stega: false,
  })

  return data ?? []
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const resolvedParams = await params
  const { data: post } = await sanityFetch({
    query: postQuery,
    params: resolvedParams,
    stega: false,
  })

  if (!post) {
    return {}
  }

  const ogImage = resolveOpenGraphImage(post.coverImage)
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: post.title,
    description: post.excerpt,
    authors: post.author?.firstName && post.author?.lastName
      ? [{ name: `${post.author.firstName} ${post.author.lastName}` }]
      : [],
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const resolvedParams = await params
  const { data: post } = await sanityFetch({
    query: postQuery,
    params: resolvedParams,
  })

  if (!post?._id) {
    return notFound()
  }

  return (
    <>
      <article className='bg-dark p-6 rounded-4xl'>
        <header className="pb-6 mb-6 grid gap-6">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
            {post.title}
          </h1>
        </header>

        {post.content?.length && (
          <section className="max-w-2xl">
            <PortableText value={(post.content as unknown as PortableTextBlock[]).filter((block) => block._type === 'block')} />
          </section>
        )}
      </article>

      <aside className="">
        <div className="container py-12 lg:py-24 grid gap-12">
          <Suspense>
            <MorePosts skip={post._id} limit={2} />
          </Suspense>
        </div>
      </aside>
    </>
  )
}
