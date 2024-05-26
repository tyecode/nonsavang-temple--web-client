import { z } from 'zod'

export const userCreateSchema = z.object({
  title: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນຄຳນຳໜ້າ.',
  }),
  first_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນຊື່.',
  }),
  last_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນນາມສະກຸນ.',
  }),
  email: z
    .string()
    .min(1, {
      message: 'ກະລຸນາປ້ອນອີເມວ.',
    })
    .email({
      message: 'ອີເມວບໍ່ຖືກຕ້ອງ.',
    }),
  password: z.string().min(8, {
    message: 'ລະຫັດຜ່ານຕ້ອງຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ.',
  }),
})

export const userUpdateSchema = z.object({
  title: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນຄຳນຳໜ້າ.',
  }),
  first_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນຊື່.',
  }),
  last_name: z.string().min(1, {
    message: 'ກະລຸນາປ້ອນນາມສະກຸນ.',
  }),
  role: z.string().min(1, {
    message: 'ກະລຸນາເລືອກສິດຜູ້ໃຊ້.',
  }),
  image: z
    .custom<FileList>()
    .nullable()
    .transform((file) => (file && file.length > 0 ? file.item(0) : null))
    .refine((file) => file === null || file.type?.startsWith('image'), {
      message: 'ອັບໂຫຼດໄດ້ສະເພາະຮູບພາບເທົ່ານັ້ນ.',
    })
    .refine((file) => file === null || file.size <= 3 * 1024 * 1024, {
      message: 'ຮູບພາບຕ້ອງມີຂະໜາດບໍ່ເກີນ 3MB.',
    }),
})
