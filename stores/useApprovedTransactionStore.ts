import { create } from 'zustand'
import { Transaction } from '@/types'
import { formatDate } from '@/lib/date-format'

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
          created_at: formatDate(item.created_at),
          approved_at: item.approved_at
            ? formatDate(item.approved_at)
            : undefined,
          rejected_at: item.rejected_at
            ? formatDate(item.rejected_at)
            : undefined,
        }))
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) as unknown as Transaction[],
    })),
}))
