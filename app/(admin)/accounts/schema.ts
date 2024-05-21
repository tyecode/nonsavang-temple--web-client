import { z } from 'zod'

export const accountSchema = z.object({
  name: z.string().min(1, 'ກະລຸນາປ້ອນຊື່ບັນຊີ.'),
  balance: z
    .string()
    .min(1, 'ກະລຸນາປ້ອນຈຳນວນເງິນ.')
    .regex(/^[-]?\d+$/, {
      message: 'ຈຳນວນເງິນຕ້ອງເປັນຕົວເລກເທົ່ານັ້ນ.',
    })
    .refine((value) => Number(value) >= 0, {
      message: 'ປ້ອນຈຳນວນເງິນບໍ່ຖືກຕ້ອງ.',
    })
    .or(z.number().min(1, 'ກະລຸນາປ້ອນຈຳນວນເງິນ.')),
  currency: z.string().min(1, 'ກະລຸນາເລືອກສະກຸນເງິນ.'),
  remark: z.string(),
})
