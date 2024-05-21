import { z } from 'zod'

export const currencySchema = z.object({
  code: z
    .string()
    .min(1, {
      message: 'ກະລຸນາປ້ອນລະຫັດສະກຸນເງິນ.',
    })
    .regex(/^[A-Z]{3}$/, {
      message: 'ລະຫັດສະກຸນເງິນຕ້ອງມີຕົວອັກສອນ 3 ຕົວເທົ່ານັ້ນ.',
    }),
  name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນຊື່ສະກຸນເງິນ.',
  }),
  symbol: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນສັນຍາລັກສະກຸນເງິນ.',
  }),
})
