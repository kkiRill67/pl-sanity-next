import {DocumentTextIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'

/**
 * Схема рецепта. Определение и редактирование полей для типа контента 'post' (рецепты).
 * Подробнее: https://www.sanity.io/docs/schema-types
 */

export const post = defineType({
  name: 'post',
  title: 'Рецепт',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название рецепта',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'URL-адрес',
      type: 'slug',
      description: 'URL-адрес необходим для отображения рецепта в превью',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'calories',
      title: 'Калории на порцию',
      type: 'number',
      description: 'Приблизительное количество калорий на порцию (необязательно)',
    }),

    // Белки, жиры, углеводы (КБЖУ)
    defineField({
      name: 'protein',
      title: 'Белки',
      type: 'number',
      description: 'Количество белков в граммах (необязательно)',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'fat',
      title: 'Жиры',
      type: 'number',
      description: 'Количество жиров в граммах (необязательно)',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'carbs',
      title: 'Углеводы',
      type: 'number',
      description: 'Количество углеводов в граммах (необязательно)',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'coverImage',
      title: 'Обложка',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Альтернативный текст',
          description: 'Важно для SEO и доступности.',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return 'Обязательно'
              }
              return true
            })
          },
        },
      ],
    }),

    // Ссылка на изображение блюда, если обложка не загружена
    defineField({
      name: 'imageUrl',
      title: 'Ссылка на изображение',
      type: 'url',
      description: 'Ссылка на изображение блюда, если обложка не загружена',
    }),

    defineField({
      name: 'servings',
      title: 'Количество порций',
      type: 'number',
      description: 'Количество порций',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'prepTime',
      title: 'Время подготовки',
      type: 'number',
      description: 'Время подготовки в минутах',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'cookTime',
      title: 'Время готовки',
      type: 'number',
      description: 'Время готовки в минутах',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'difficulty',
      title: 'Уровень сложности',
      type: 'string',
      options: {
        list: [
          {title: 'Легко', value: 'easy'},
          {title: 'Средне', value: 'medium'},
          {title: 'Сложно', value: 'hard'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Категория',
      type: 'string',
      description: 'Категория рецепта (например: Завтрак, Обед, Ужин, Десерт)',
    }),
    defineField({
      name: 'ingredients',
      title: 'Ингредиенты',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Название ингредиента',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'amount',
              title: 'Количество',
              type: 'string',
              description: 'Например: "2 стакана", "500г", "1 ст.л."',
              validation: (rule) => rule.required(),
            },
            {
              name: 'notes',
              title: 'Заметки',
              type: 'string',
              description: 'Дополнительные заметки об ингредиенте (необязательно)',
            },
          ],
          preview: {
            select: {
              name: 'name',
              amount: 'amount',
            },
            prepare({name, amount}) {
              return {
                title: name,
                subtitle: amount,
              }
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'content',
      title: 'Инструкции',
      type: 'array',
      description: 'Пошаговые инструкции по приготовлению',
      of: [
        {
          type: 'recipeStep',
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'date',
      title: 'Дата добавления',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Автор',
      type: 'reference',
      to: [{type: 'person'}],
    }),
  ],
  // Конфигурация превью в списке. https://www.sanity.io/docs/previews-list-views
  preview: {
      select: {
        title: 'title',
        servings: 'servings',
        prepTime: 'prepTime',
        cookTime: 'cookTime',
        difficulty: 'difficulty',
        category: 'category',
        authorFirstName: 'author.firstName',
        authorLastName: 'author.lastName',
        date: 'date',
        media: 'coverImage',
      },
    prepare({title, media, servings, prepTime, cookTime, difficulty, category, authorFirstName, authorLastName, date}) {
      const totalTime = prepTime && cookTime ? prepTime + cookTime : null
      const difficultyLabels: Record<string, string> = {
        easy: 'Легко',
        medium: 'Средне',
        hard: 'Сложно',
      }
      const subtitles = [
        servings && `${servings} ${servings === 1 ? 'порция' : servings < 5 ? 'порции' : 'порций'}`,
        totalTime && `${totalTime} мин`,
        difficulty && difficultyLabels[difficulty] || difficulty,
        category,
        authorFirstName && authorLastName && `автор: ${authorFirstName} ${authorLastName}`,
        date && format(parseISO(date), 'd MMM yyyy'),
      ].filter(Boolean)

      const finalMedia = media || imageUrl
      return {title, media: finalMedia, subtitle: subtitles.join(' • ')}
    },
  },
})
