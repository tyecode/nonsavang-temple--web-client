import { create } from 'zustand'
import { Account } from '@/types/account'

interface AccountState {
  accounts: Account[]
  setAccounts: (state: Account[]) => void
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  setAccounts: (state) => set(() => ({ accounts: state })),
}))
