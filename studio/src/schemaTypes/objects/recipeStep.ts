import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

/**
 * Шаг рецепта. Объект для пошаговых инструкций с возможностью добавления изображения.
 * Подробнее: https://www.sanity.io/docs/object-type
 */

export const recipeStep = defineType({
  name: 'recipeStep',
  title: 'Шаг рецепта',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'stepNumber',
      title: 'Номер шага',
      type: 'number',
      description: 'Номер шага (будет автоматически проставлен, если не указан)',
    }),
    defineField({
      name: 'instruction',
      title: 'Инструкция',
      type: 'text',
      description: 'Текстовая инструкция для этого шага',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Изображение',
      type: 'image',
      description: 'Изображение для этого шага (необязательно)',
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
        },
      ],
    }),
  ],
  preview: {
    select: {
      stepNumber: 'stepNumber',
      instruction: 'instruction',
      media: 'image',
    },
    prepare({stepNumber, instruction, media}) {
      const step = stepNumber ? `Шаг ${stepNumber}` : 'Шаг'
      const preview = instruction ? instruction.substring(0, 60) : 'Без описания'
      return {
        title: step,
        subtitle: preview + (instruction && instruction.length > 60 ? '...' : ''),
        media: media,
      }
    },
  },
})

