import { create } from 'zustand'
import { Transaction } from '@/types'

export interface TransactionState {
  transactions: Transaction[]
  setTransactions: (state: Transaction[]) => void
}

export const useApprovedTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  setTransactions: (state: Transaction[]) =>
    set(() => ({
      transactions: state
        .map((item) => ({
          ...item,
          participant: {
            ...item.participant,
            display_name: item.donator
              ? `${item.donator.title} ${item.donator.first_name} ${item.donator.last_name}`
              : item.drawer
                ? `${item.drawer.title} ${item.drawer.first_name} ${item.drawer.last_name}`
                : undefined,
          },
        }))
        .sort(
          (a, b) =>
            new Date(b.approved_at || '').getTime() -
            new Date(a.approved_at || '').getTime()
        ) as unknown as Transaction[],
    })),
}))
