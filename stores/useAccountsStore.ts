import { create } from 'zustand'
import { Account } from '@/types/account'

interface AccountState {
  accounts: Account[]
  updateAccounts: (accounts: Account[]) => void
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  updateAccounts: (accounts) => set(() => ({ accounts: [...accounts] })),
}))
