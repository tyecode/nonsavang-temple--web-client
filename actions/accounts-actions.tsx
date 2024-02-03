'use server'

import { prisma } from '@/lib/prisma-client'
import { Accounts } from '@prisma/client'

export const getAccounts = async () => {
  try {
    const data: Accounts[] = await prisma.accounts.findMany()

    return {
      data,
      message: `Retrieved accounts`,
    }
  } catch (error) {
    return {
      error,
      data: [],
      message: 'Could not retrieve accounts',
    }
  }
}

export const createAccounts = async () => {
  try {
    const data: Accounts[] = await prisma.accounts.findMany()

    return {
      data,
      message: `Retrieved accounts`,
    }
  } catch (error) {
    return {
      error,
      data: [],
      message: 'Could not retrieve accounts',
    }
  }
}
