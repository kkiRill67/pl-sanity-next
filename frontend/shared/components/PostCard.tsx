'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Image } from 'next-sanity/image'
import { getImageDimensions } from '@sanity/asset-utils'
import { FaFire, FaDna, FaDroplet, FaBowlFood } from 'react-icons/fa6'

import { createDataAttribute } from 'next-sanity'
import { urlForImage } from '@/sanity/lib/utils'
import { Tooltip } from '@heroui/react'

type PostCardProps = {
  post: any
}

export default function PostCard({ post }: PostCardProps) {
  const { _id, title, slug, excerpt, coverImage, calories } = post

  const attr = createDataAttribute({
    id: _id,
    type: 'post',
    path: 'title',
  })

  const imageUrl = coverImage?.asset?._ref ? urlForImage(coverImage as any)?.url() : post.imageUrl || null
  const imageDimensions = coverImage?.asset?._ref ? getImageDimensions(coverImage as any) : null

  return (
    <article
      data-sanity={attr()}
      key={_id}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark via-dark/95 to-dark/90 border border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-green-body/25 hover:border-green-body/40 flex flex-col backdrop-blur-sm"
    >
      {/* Картинка с оверлеем */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
        {coverImage?.asset?._ref && imageDimensions ? (
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
        )}

        {/* Градиентный оверлей */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

        {/* Калории в углу с новым дизайном */}
        {(calories || post.protein || post.fat || post.carbs) && (
          <div className="absolute top-3 left-3 right-3 flex justify-between bg-dark/90 backdrop-blur-md rounded-lg px-2 py-1 border border-green-body/20 shadow-lg group-hover:border-green-body/40 group-hover:shadow-green-body/20 transition-all duration-300">
            {calories && (
              <Tooltip
                content='Ккал'
                classNames={{
                  base: [
                    "bg-dark rounded-xl",
                  ],
                  content: ["py-2 px-4 shadow-xl"],
                }}
              >
                <div className="flex items-center gap-1 text-xs font-medium">
                  <FaFire className="text-green-body" size={12} />
                  <span className="text-white">{calories}</span>
                </div>
              </Tooltip>
            )}
            {post.protein && (
              <Tooltip
                content='Белки'
                classNames={{
                  base: [
                    "bg-dark rounded-xl",
                  ],
                  content: ["py-2 px-4 shadow-xl"],
                }}
              >
                <div className="flex items-center gap-1 text-xs font-medium">
                  <FaDna className="text-green-body" size={12} />
                  <span className="text-white">{post.protein}</span>
                </div>
              </Tooltip>
            )}
            {post.fat && (
              <Tooltip
                content='Жиры'
                classNames={{
                  base: [
                    "bg-dark rounded-xl",
                  ],
                  content: ["py-2 px-4 shadow-xl"],
                }}
              >
                <div className="flex items-center gap-1 text-xs font-medium">
                  <FaDroplet className="text-green-body" size={12} />
                  <span className="text-white">{post.fat}</span>
                </div>
              </Tooltip>
            )}
            {post.carbs && (
              <Tooltip
                content='Углеводы'
                classNames={{
                  base: [
                    "bg-dark rounded-xl",
                  ],
                  content: ["py-2 px-4 shadow-xl"],
                }}
              >
                <div className="flex items-center gap-1 text-xs font-medium">
                  <FaBowlFood className="text-green-body" size={12} />
                  <span className="text-white">{post.carbs}</span>
                </div>
              </Tooltip>
            )}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow relative">
        {/* Заголовок */}
        <h3 className="text-lg font-bold mb-2 leading-tight text-white group-hover:text-green-body transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        {/* Краткое описание */}
        {excerpt && (
          <p className="line-clamp-3 text-sm leading-6 text-gray-300 mb-3 flex-grow">
            {excerpt}
          </p>
        )}

        {/* Новый футер с разделением */}
        <div className="mt-auto pt-3 border-t border-white/10 group-hover:border-green-body/20 transition-colors duration-300">
          <Link
            href={`/food/${slug}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-green-body to-green-body/90 text-dark font-semibold text-sm rounded-lg hover:from-green-body/95 hover:to-green-body transition-all duration-300 shadow-lg hover:shadow-green-body/40 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Подробнее
            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
