import { Accounts } from '@prisma/client'
import { create } from 'zustand'

interface AccountState {
  accounts: Accounts[]
  updateAccounts: (accounts: AccountState['accounts']) => void
}

export const useAccountsStore = create<AccountState>((set) => ({
  accounts: [],
  updateAccounts: (accounts) => set(() => ({ accounts: [...accounts] })),
}))
