import { sanityFetch } from '@/sanity/lib/live'
import { morePostsQuery, allPostsQuery } from '@/sanity/lib/queries'
import { Post as PostType, AllPostsQueryResult } from '@/sanity.types'
import Onboarding from './Onboarding'
import PostCard from './PostCard'

const Posts = ({
  children,
  heading,
  subHeading,
}: {
  children: React.ReactNode
  heading?: string
  subHeading?: string
}) => (
  <div>
    {heading && (
      <h2 className="text-lg font-bold tracking-tight sm:text-xl lg:text-2xl mb-1">
        {heading}
      </h2>
    )}
    {subHeading && <p className="mt-1 text-xs leading-5 mb-2">{subHeading}</p>}
    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">{children}</div>
  </div>
)

export const MorePosts = async ({ skip, limit }: { skip: string; limit: number }) => {
  const { data } = await sanityFetch({
    query: morePostsQuery,
    params: { skip, limit },
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Posts heading={`Recent Posts (${data?.length})`}>
      {data?.map((post: any) => (
        <PostCard key={post._id} post={post} />
      ))}
    </Posts>
  )
}

export const AllPosts = async () => {
  const { data } = await sanityFetch({ query: allPostsQuery })

  if (!data || data.length === 0) {
    return <Onboarding />
  }

  return (
    <Posts heading="Последние рецепты">
      {data.map((post: any) => (
        <PostCard key={post._id} post={post} />
      ))}
    </Posts>
  )
}
