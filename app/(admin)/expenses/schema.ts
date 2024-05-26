import { z } from 'zod'

export const expenseSchema = z.object({
  account: z.string().min(1, 'ກະລຸນາເລືອກບັນຊີ.'),
  category: z.string().min(1, 'ກະລຸນາເລືອກປະເພດລາຍຈ່າຍ.'),
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
  drawer: z.string().min(1, 'ກະລຸນາເລືອກຜູ້ເບີກຈ່າຍ.'),
  image: z
    .custom<FileList>()
    .nullable()
    .transform((file) => (file && file.length > 0 ? file.item(0) : null))
    .refine((file) => file === null || file.type?.startsWith('image'), {
      message: 'ອັບໂຫຼດໄດ້ສະເພາະຮູບພາບເທົ່ານັ້ນ.',
    })
    .refine((file) => file === null || file.size <= 10 * 1024 * 1024, {
      message: 'ຮູບພາບຕ້ອງມີຂະໜາດບໍ່ເກີນ 10MB.',
    }),
  remark: z.string(),
})
