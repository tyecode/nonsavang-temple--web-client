import { z } from 'zod'

export const expenseCategorySchema = z.object({
  name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນປະເພດລາຍຈ່າຍ.',
  }),
})
