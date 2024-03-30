'use server'

import { Expense, Income, Transaction } from '@/types'

import { getIncome } from './income-actions'
import { getExpense } from './expense-actions'

export const getTransactions = async () => {
  try {
    const incomes = await getIncome()
    const expenses = await getExpense()

    if (incomes.error || expenses.error) return

    const data: Transaction[] = [
      ...incomes.data.map((income: Income) => ({
        ...income,
        transaction_type: 'income',
      })),
      ...expenses.data.map((expense: Expense) => ({
        ...expense,
        transaction_type: 'expense',
      })),
    ].sort((a, b) => b.created_at - a.created_at)

    return {
      data,
      error: null,
      message: `Transactions retrieval was successful.`,
    }
  } catch (error) {
    return {
      data: null,
      error,
      message: `Failed to retrieve transactions. Please try again.`,
    }
  }
}
