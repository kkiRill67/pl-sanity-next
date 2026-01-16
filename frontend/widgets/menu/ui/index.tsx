'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdOutlineFreeBreakfast, MdOutlineRestaurant, MdOutlineCake, MdOutlineLocalDrink, MdOutlineFastfood, MdOutlineGrass, MdOutlineWineBar, MdOutlineIcecream, MdOutlineLunchDining, MdOutlineSoupKitchen } from 'react-icons/md';

const categories = [
  { name: 'Завтраки', slug: 'breakfasts', icon: MdOutlineFreeBreakfast },
  { name: 'Морепродукты', slug: 'seafood', icon: MdOutlineRestaurant },
  { name: 'Десерты', slug: 'desserts', icon: MdOutlineCake },
  { name: 'Напитки', slug: 'drinks', icon: MdOutlineLocalDrink },
  { name: 'Мясо', slug: 'meat', icon: MdOutlineFastfood },
  { name: 'Салаты', slug: 'salads', icon: MdOutlineGrass },
  { name: 'Вина', slug: 'wines', icon: MdOutlineWineBar },
  { name: 'Сладкое', slug: 'sweets', icon: MdOutlineIcecream },
  { name: 'Супы', slug: 'soups', icon: MdOutlineSoupKitchen },
  { name: 'Закуски', slug: 'snacks', icon: MdOutlineLunchDining },
];

export function Menu() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-gradient-to-br from-dark/90 via-dark/80 to-dark/95 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-layer">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1.5 h-6 bg-green-body rounded-full"></div>
        <h2 className="text-xl font-bold text-white tracking-tight">Категории блюд</h2>
      </div>

      <nav className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {categories.map((category) => {
          const isActive = pathname === `/food/${category.slug}` || pathname?.startsWith(`/food/${category.slug}/`);

          return (
            <Link
              key={category.slug}
              href={`/food/${category.slug}`}
              className={`
                group relative overflow-hidden
                flex items-center gap-2.5 px-4 py-3.5 rounded-xl
                transition-all duration-300 ease-out
                ${isActive
                  ? 'bg-gradient-to-r from-[#adec07] to-[#9edb05] text-dark font-semibold shadow-lg shadow-[#adec07]/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-[#adec07]/50'
                }
              `}
            >
              {/* Animated background for active state */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              )}

              {/* Icon with transition */}
              <category.icon
                size={20}
                className={`
                  transition-transform duration-300
                  ${isActive ? 'text-dark' : 'text-white/60 group-hover:text-[#adec07] group-hover:scale-110'}
                `}
              />

              {/* Label */}
              <span className={`
                relative z-10 text-sm font-medium
                ${isActive ? 'text-dark' : 'text-white/80'}
              `}>
                {category.name}
              </span>

              {/* Hover underline effect for non-active items */}
              {!isActive && (
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#adec07] transition-all duration-300 group-hover:w-full"></div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
