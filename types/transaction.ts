import { Income } from './income'
import { Expense } from './expense'
import { User } from './user'
import { Donator } from './donator'

export interface Transaction extends Income, Expense {
  participant: User | Donator | null
  __typename: 'Income' | 'Expense'
}
