import { z } from 'zod'

export const incomeSchema = z.object({
  account: z.string().min(1, 'ກະລຸນາເລືອກບັນຊີ.'),
  category: z.string().min(1, 'ກະລຸນາເລືອກປະເພດລາຍຮັບ.'),
  amount: z
    .string()
    .min(1, 'ກະລຸນາປ້ອນຈຳນວນເງິນ.')
    .regex(/^[-]?\d+$/, {
      message: 'ຈຳນວນເງິນຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ.',
    })
    .refine((value) => Number(value) > 0, {
      message: 'ປ້ອນຈຳນວນເງິນບໍ່ຖືກຕ້ອງ.',
    })
    .or(z.number().min(1, 'ກະລຸນາປ້ອນຈຳນວນເງິນ.')),
  currency: z.string().min(1, 'ກະລຸນາເລືອກສະກຸນເງິນ.'),
  donator: z
    .string()
    .nullable()
    .refine((value) => value !== 'donate', {
      message: 'ກະລຸນາເລືອກຜູ້ບໍລິຈາກ.',
    }),
  remark: z.string(),
})
