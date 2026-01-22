import { sanityFetch } from '@/sanity/lib/live'
import { topPostsGroupedQuery } from '@/sanity/lib/queries'
import { CategorySlider } from './CategorySlider'

interface Post {
  _id: string
  title: string
  slug?: string
  coverImage?: any
  imageUrl?: string
  category?: string
  servings?: number
  prepTime?: number
  cookTime?: number
  difficulty?: string
  calories?: number
}

export async function CategorySliderServer() {
  const { data } = await sanityFetch({ query: topPostsGroupedQuery })

  if (!data || data.length === 0) {
    return null
  }

  // Преобразуем данные для совместимости с интерфейсом Post
  const posts: Post[] = data.map((post: any) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug,
    coverImage: post.coverImage,
    imageUrl: post.imageUrl,
    category: post.category,
    servings: post.servings,
    prepTime: post.prepTime,
    cookTime: post.cookTime,
    difficulty: post.difficulty,
    calories: post.calories,
  }))

  return <CategorySlider posts={posts} />
}