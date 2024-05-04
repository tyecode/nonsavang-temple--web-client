import { create } from 'zustand'
import { Transaction } from '@/types'

export interface TransactionState {
  transactions: Transaction[]
  setTransactions: (state: Transaction[]) => void
}

export const useRejectedTransactionStore = create<TransactionState>((set) => ({
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
        .sort((a, b) => {
          const aDate = a.rejected_at ? new Date(a.rejected_at).getTime() : 0
          const bDate = b.rejected_at ? new Date(b.rejected_at).getTime() : 0
          return bDate - aDate
        }) as unknown as Transaction[],
    })),
}))
