import { z } from 'zod'

export const donatorSchema = z.object({
  title: z.string().min(1, {
    message: 'ກະລຸນາເລືອກຄຳນຳໜ້າ.',
  }),
  first_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນຊື່.',
  }),
  last_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນນາມສະກຸນ.',
  }),
  village: z.string(),
  district: z.string(),
  province: z.string(),
})
