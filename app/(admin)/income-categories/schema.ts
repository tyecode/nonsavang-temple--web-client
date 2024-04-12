import { z } from 'zod'

export const incomeCategorySchema = z.object({
  name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນປະເພດລາຍຮັບ.',
  }),
})
