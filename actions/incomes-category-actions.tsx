'use server'

import { prisma } from '@/lib/prisma-client'

export const getIncomesCategory = async () => {
  const data = prisma.incomesCategory.findMany()

  return data
}
