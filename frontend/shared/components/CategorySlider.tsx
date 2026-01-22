'use client'

import Link from 'next/link'
import { getImageDimensions } from '@sanity/asset-utils'

import { CardWrapper } from '@/shared/ui/card'
import { urlForImage } from '@/sanity/lib/utils'
import Image from 'next/image'

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

interface CategorySliderProps {
  posts: Post[]
}

const PostCard = ({ post }: { post: Post }) => {
  const { title, slug, coverImage, calories } = post
  const imageUrl = coverImage?.asset?._ref ? urlForImage(coverImage as any)?.url() : post.imageUrl || null
  const imageDimensions = coverImage?.asset?._ref ? getImageDimensions(coverImage as any) : null

  return (
    <Link href={`/food/${slug}`}>
      <CardWrapper
        header={
          imageUrl && imageDimensions ? (
            <Image
              src={imageUrl}
              alt={coverImage?.alt || title || ''}
              width={imageDimensions.width}
              height={imageDimensions.height}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={title || ''}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-gray-500 text-4xl">🍽️</div>
            </div>
          )
        }
        className="min-w-[280px]"
      >
        <div className="space-y-1">
          <h3 className="font-semibold text-sm truncate">{post.title}</h3>
          <div className="flex flex-wrap gap-1 text-xs text-gray-400">
            {post.category && (
              <span className="bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">
                {post.category}
              </span>
            )}
            {calories && (
              <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">
                {calories} ккал
              </span>
            )}
            {post.difficulty && (
              <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                {post.difficulty === 'easy' ? 'Легко' : post.difficulty === 'medium' ? 'Средне' : 'Сложно'}
              </span>
            )}
          </div>
          {post.prepTime && post.cookTime && (
            <div className="text-xs text-gray-500">
              ⏱️ {post.prepTime + post.cookTime} мин
            </div>
          )}
        </div>
      </CardWrapper>
    </Link>
  )
}

const CategorySection = ({ category, posts }: { category: string; posts: Post[] }) => {
  if (!posts.length) return null

  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
          Топ {posts.length} блюд в категории "{category}"
        </h2>
        <div className="flex-1 h-px bg-gray-700" />
      </div>

      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="flex gap-4 min-w-max">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Функция для группировки по категориям и сортировки по калориям
const groupByCategory = (posts: Post[]): Record<string, Post[]> => {
  const groups: Record<string, Post[]> = {}

  posts.forEach((post) => {
    if (post.category) {
      if (!groups[post.category]) {
        groups[post.category] = []
      }
      groups[post.category].push(post)
    }
  })

  // Сортируем по калориям (по убыванию) и берем топ 10
  Object.keys(groups).forEach((category) => {
    groups[category] = groups[category]
      .sort((a, b) => (b.calories || 0) - (a.calories || 0))
      .slice(0, 10)
  })

  return groups
}

export function CategorySlider({ posts }: CategorySliderProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  const groupedPosts = groupByCategory(posts)

  // Сортируем категории по количеству блюд
  const sortedCategories = Object.entries(groupedPosts)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 4) // Показываем топ 4 категории

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl mb-2">
        🍽️ Топ блюд по категориям
      </h1>
      <p className="text-gray-400 mb-8">
        Лучшие рецепты по калорийности и популярности
      </p>

      {sortedCategories.map(([category, posts]) => (
        <CategorySection key={category} category={category} posts={posts} />
      ))}
    </div>
  )
}