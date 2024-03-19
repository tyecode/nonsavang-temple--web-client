import { create } from 'zustand'
import { Account } from '@/types/account'

export interface AccountState {
  accounts: Account[]
  setAccounts: (state: Account[]) => void
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  setAccounts: (state) =>
    set(() => ({
      accounts: state.map((account) => ({
        ...account,
        user: account.user && {
          ...account.user,
          display_name: `${account.user.title} ${account.user.first_name} ${account.user.last_name}`,
        },
      })),
    })),
}))
