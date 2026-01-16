import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Image } from 'next-sanity/image'
import { getImageDimensions } from '@sanity/asset-utils'
import { FaFire, FaDna, FaDroplet, FaBowlFood } from 'react-icons/fa6'
import { LuUsers, LuClock, LuChefHat, LuActivity, LuZap } from 'react-icons/lu'

import { sanityFetch } from '@/sanity/lib/live'
import { postPagesSlugs, postQuery } from '@/sanity/lib/queries'
import { resolveOpenGraphImage, urlForImage } from '@/sanity/lib/utils'
import { MorePosts } from '@/shared/components/Posts'
import CoverImage from '@/shared/components/CoverImage'
import type { Post } from '@/sanity.types';

// removed unused import

type Props = {
  params: Promise<{ slug: string }>
};

type FullPost = Post & {
  ingredients?: { name: string; amount: string; notes?: string }[];
  content?: {
    stepNumber?: number;
    instruction?: string;
    image?: any;
  }[];
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  difficulty?: string;
  category?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
};

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

export default async function FoodPage({ params }: Props) {
  const resolvedParams = await params
  const { data: post } = await sanityFetch({
    query: postQuery,
    params: resolvedParams,
  })

  if (!post?._id) {
    return notFound()
  }

  const difficultyLabels: Record<string, string> = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно',
  }

  const totalTime = post.prepTime && post.cookTime ? post.prepTime + post.cookTime : null

  return (
    <>
      <article className="bg-[#0d0e12] min-h-screen flex flex-col lg:flex-row gap-4 sm:gap-6 p-2 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden font-sans">
        {/* Futuristic Background Accents - Optimized for performance */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-green-body/5 blur-[200px] pointer-events-none z-0" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-green-body/3 blur-[150px] pointer-events-none z-0" />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col gap-6 sm:gap-8 lg:gap-10 z-10">
          {/* Header Section */}
          <div className="bg-[#121418] rounded-xl sm:rounded-2xl border border-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 lg:gap-8">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="text-gray-400 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl border-l-2 border-green-body/30 pl-3 sm:pl-4 py-1">
                    {post.excerpt}
                  </p>
                )}
              </div>

              {/* Quick Stats Panel */}
              <div className="flex flex-row md:flex-col gap-2 sm:gap-3">
                {post.servings && (
                  <div className="flex items-center gap-2 bg-[#0d0e12] px-3 py-2 rounded-lg border border-gray-800">
                    <LuUsers className="w-3 h-3 sm:w-4 sm:h-4 text-green-body" />
                    <span className="text-[10px] sm:text-xs font-black text-white">{post.servings} <span className="text-gray-500 font-bold">порций</span></span>
                  </div>
                )}
                {totalTime && (
                  <div className="flex items-center gap-2 bg-[#0d0e12] px-3 py-2 rounded-lg border border-gray-800">
                    <LuClock className="w-3 h-3 sm:w-4 sm:h-4 text-green-body" />
                    <span className="text-[10px] sm:text-xs font-black text-white">{totalTime} <span className="text-gray-500 font-bold">мин.</span></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nutrients Cards - Flex layout with wrap for better responsiveness */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
            {[
              { label: 'Ккал', val: `${post.calories || '--'}`, unit: 'Kcal', icon: FaFire, color: 'text-orange-500', glow: 'from-orange-500/20' },
              { label: 'Белки', val: `${post.protein || '--'}`, unit: '', icon: FaDna, color: 'text-blue-500', glow: 'from-blue-500/20' },
              { label: 'Углеводы', val: `${post.carbs || '--'}`, unit: '', icon: FaBowlFood, color: 'text-yellow-500', glow: 'from-yellow-500/20' },
              { label: 'Жиры', val: `${post.fat || '--'}`, unit: '', icon: FaDroplet, color: 'text-purple-500', glow: 'from-purple-500/20' },
            ].map((item, i) => (
              <div key={i} className="flex-1 min-w-[140px] sm:min-w-[160px] bg-gradient-to-br from-[#121418] to-[#0d0e12] p-3 sm:p-4 rounded-xl border border-gray-800/50 hover:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group hover:translate-y-[-2px]">
                <div className={`flex items-center gap-2 mb-2 sm:mb-3`}>
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${item.glow} flex items-center justify-center ${item.color} border border-gray-800`}>
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <p className="text-gray-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-0.5">
                  <span className="text-white text-lg sm:text-xl font-black">{item.val}</span>
                  <span className="text-white text-[10px] sm:text-xs font-bold opacity-70">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Visual - Cover Image */}
          {post.coverImage && (
            <div className="relative group mb-6 sm:mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-body/20 via-green-body/5 to-transparent opacity-20 group-hover:opacity-30 transition-all duration-500 blur-3xl rounded-2xl sm:rounded-3xl" />
              <div className="relative aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-800 shadow-2xl group-hover:shadow-[0_0_50px_rgba(173,236,7,0.2)] transition-all duration-500">
                <CoverImage image={post.coverImage} priority />
                {/* Overlay gradient for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Cooking Section */}
          <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
            {/* Ingredients */}
            {(post.ingredients ?? []).length > 0 && (
              <section className="bg-[#121418] rounded-xl sm:rounded-2xl border border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-800/50 bg-[#0d0e12]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-body/10 border border-green-body/20 flex items-center justify-center text-green-body">
                      <span className="font-black text-sm">🥗</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Ингредиенты</h2>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest">кол-во: {((post as any).ingredients?.length ?? 0)}</span>
                </div>

                <div className="flex flex-col divide-y divide-gray-800/50">
                  {(post.ingredients ?? []).map((ingredient: any, index: number) => (
                    <div key={index} className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-[#1a1b1e] transition-colors duration-200">
                      {/* Index Badge */}
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 font-black text-sm sm:text-base group-hover:border-green-body/50 transition-all">
                          {index + 1}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-body border-2 border-[#121418] flex items-center justify-center text-black scale-0 group-hover:scale-100 transition-transform duration-300">
                          <span className="text-[7px] sm:text-[8px] font-black">✓</span>
                        </div>
                      </div>

                      {/* Ingredient Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm sm:text-base font-bold sm:font-black leading-tight mb-0.5 group-hover:text-green-body transition-colors">
                          {ingredient.name}
                        </h4>
                        <p className="text-gray-500 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider truncate">
                          Measure: <span className="text-gray-400">{ingredient.amount}</span>
                        </p>
                      </div>

                      {/* Action Button */}
                      {/* <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-700/50 hover:border-green-body hover:bg-green-body hover:text-black text-gray-400 text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex-shrink-0">
                        Add
                      </button> */}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Steps */}
            {(post.content ?? []).length > 0 && (
              <section className="flex flex-col gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Шаги</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-gray-800/50 via-green-body/20 to-transparent" />
                  <span className="text-[10px] sm:text-xs font-black text-gray-0 text-gray-500 uppercase tracking-widest">Кол-во: {((post as any).content?.length ?? 0)}</span>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4">
                  {(post.content ?? []).map((step: any, index: number) => {
                    const stepNumber = step.stepNumber || index + 1
                    return (
                      <div
                        key={step._key || index}
                        className="group flex gap-3 sm:gap-4 p-3 sm:p-4 bg-[#121418] border border-gray-800/50 rounded-xl hover:border-green-body/30 hover:bg-[#16181c] transition-all duration-300"
                      >
                        {/* Step Number */}
                        <div className="flex-shrink-0 flex flex-col items-center gap-1">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-body/20 to-transparent border border-green-body/30 flex items-center justify-center text-green-body font-black text-sm sm:text-base group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(173,236,7,0.1)]">
                            {stepNumber}
                          </div>
                          {index < (post.content?.length ?? 0) - 1 && (
                            <div className="w-px h-full bg-gradient-to-b from-green-body/30 to-transparent" />
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3">
                          {step.image?.asset?._ref && (
                            <div className="relative overflow-hidden rounded-lg sm:rounded-xl border border-gray-800 group-hover:border-gray-700 transition-colors">
                              <Image
                                className="object-cover w-full aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                                width={getImageDimensions(step.image).width}
                                height={getImageDimensions(step.image).height}
                                alt={step.image?.alt || `Step ${stepNumber}`}
                                src={urlForImage(step.image)?.url() as string}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          )}
                          <div className="bg-[#0d0e12] rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-800/30">
                            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium group-hover:text-gray-200 transition-colors">
                              {step.instruction}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6 sm:space-y-8">
          {/* Summary Card */}
          <div className="bg-[#16171a] p-4 sm:p-6 rounded-xl sm:rounded-[3rem] border border-gray-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-green-body/5 blur-2xl sm:blur-3xl rounded-full" />

            <h3 className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6 sm:mb-8">System Summary</h3>

            <div className="grid gap-5 sm:gap-8">
              {post.servings && (
                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-green-body">
                    <LuUsers className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Порций</p>
                    <p className="text-white text-sm sm:text-lg font-black">{post.servings}</p>
                  </div>
                </div>
              )}
              {totalTime && (
                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-green-body">
                    <LuClock className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Время приготовления</p>
                    <p className="text-white text-sm sm:text-lg font-black">{totalTime} мин.</p>
                  </div>
                </div>
              )}
              {post.difficulty && (
                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-green-body">
                    <LuZap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider">Уровень сложности</p>
                    <p className="text-white text-sm sm:text-lg font-black tracking-tight">{difficultyLabels[post.difficulty] || post.difficulty}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category Button Section */}
          {post.category && (
            <div className="group bg-green-body p-5 sm:p-8 rounded-xl sm:rounded-[3rem] flex items-center justify-between cursor-pointer hover:shadow-[0_0_50px_rgba(173,236,7,0.3)] transition-all duration-500 border border-white/10 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-black/10 flex items-center justify-center text-black flex-shrink-0">
                  <LuChefHat className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div className="min-w-0">
                  <p className="text-black/40 text-[8px] sm:text-[10px] font-black uppercase tracking-widest leading-none mb-1">Категория</p>
                  <p className="text-black font-black text-sm sm:text-xl leading-none truncate">{((post.category as string | undefined) ?? '').toUpperCase()}</p>
                </div>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-black/20 flex items-center justify-center text-black group-hover:bg-black group-hover:text-green-body transition-all flex-shrink-0">
                <span className="text-sm sm:text-lg font-black">→</span>
              </div>
            </div>
          )}

          {/* Profile Card matching right side of image */}
          {post.author && (
            <div className="bg-[#121418] p-4 sm:p-6 rounded-xl sm:rounded-[3.5rem] border border-gray-800 text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 sm:h-40 bg-gradient-to-b from-green-body/10 to-transparent pointer-events-none" />

              {post.author.picture && (
                <div className="relative mb-5 sm:mb-8 inline-block">
                  <div className="absolute -inset-2 sm:-inset-4 bg-green-body/5 blur-xl sm:blur-2xl rounded-full" />
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full p-1 bg-gray-800 relative z-10 transition-transform duration-500 group-hover:scale-105">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 sm:border-4 border-black">
                      <Image
                        className="object-cover"
                        width={96}
                        height={96}
                        alt={`${post.author.firstName} ${post.author.lastName}`}
                        src={urlForImage(post.author.picture)?.url() as string}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-body border-2 sm:border-4 border-[#121418] z-20 flex items-center justify-center text-black">
                    <span className="text-[8px] sm:text-[10px] font-black">💪</span>
                  </div>
                </div>
              )}

              <h4 className="text-white text-lg sm:text-xl font-black mb-1 leading-tight">{post.author.firstName} {post.author.lastName}</h4>
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-5 sm:mb-8">
                <span className="text-green-body text-[7px] sm:text-[9px] font-black uppercase">#IronChef</span>
                <span className="text-green-body text-[7px] sm:text-[9px] font-black uppercase">#HealthyLife</span>
                <span className="text-green-body text-[7px] sm:text-[9px] font-black uppercase">#TasteMaster</span>
              </div>

              <div className="flex gap-2 sm:gap-4 mb-5 sm:mb-8">
                <button className="flex-1 py-3 sm:py-4 rounded-lg sm:rounded-2xl bg-green-body text-black font-black text-[9px] sm:text-[11px] uppercase tracking-widest shadow-[0_10px_20px_-10px_rgba(173,236,7,0.5)] active:scale-95 transition-all">
                  Follow
                </button>
                <button className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl border border-gray-800 flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
                  <span className="text-lg">⋯</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-px bg-gray-800 rounded-lg sm:rounded-3xl overflow-hidden">
                <div className="bg-[#121418] p-2 sm:p-4">
                  <p className="text-gray-500 text-[7px] sm:text-[9px] font-black uppercase">Followers</p>
                  <p className="text-white text-sm sm:text-lg font-black">542</p>
                </div>
                <div className="bg-[#121418] p-2 sm:p-4">
                  <p className="text-gray-500 text-[7px] sm:text-[9px] font-black uppercase">Following</p>
                  <p className="text-white text-sm sm:text-lg font-black">1.2K</p>
                </div>
              </div>

              <div className="mt-5 pt-5 sm:mt-8 sm:pt-8 border-t border-gray-800 grid grid-cols-2 gap-2 sm:gap-4">
                <div className="text-left">
                  <p className="text-[7px] sm:text-[9px] font-black text-gray-600 uppercase tracking-widest">Released</p>
                  <p className="text-white text-[9px] sm:text-[11px] font-black">{post.date ? format(parseISO(post.date), 'MMM yyyy').toUpperCase() : 'NEW'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[7px] sm:text-[9px] font-black text-gray-600 uppercase tracking-widest">ID Log</p>
                  <p className="text-white text-[9px] sm:text-[11px] font-black overflow-hidden truncate">#{post._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </article >

      {/* Related Posts Section */}
      <section className="mt-12 sm:mt-16 lg:mt-20" >
        <div className="container py-6 sm:py-10 lg:py-16 flex flex-col gap-6 sm:gap-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">Discover More</span>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-800 via-green-body/30 to-transparent" />
            <span className="text-[10px] sm:text-xs font-black text-gray-500 uppercase tracking-widest">Recipes</span>
          </div>
          <Suspense>
            <MorePosts skip={post._id} limit={2} />
          </Suspense>
        </div>
      </section >
    </>
  )
}
