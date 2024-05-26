'use client'

import { AccountSelector } from '@/components/account-selector'
import { TotalStatusCard } from '@/components/cards/total-status-card'
import { CalendarDateRangePicker } from '@/components/date-range-picker'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  useDonatorStore,
  useExpenseStore,
  useIncomeStore,
  useUserStore,
} from '@/stores'
import { Donator, Expense, Income, User } from '@/types'
import { useEffect, useState } from 'react'
import IncomeChart from '../components/income-chart'
import { useFetchDonator, useFetchExpense, useFetchIncome } from '@/hooks'
import {
  INCOME_COLOR_PALETTE,
  EXPENSE_COLOR_PALETTE,
} from '@/constants/color-palette'
import ExpenseChart from '../components/expense-chart'
import LatestTransactionSkeleton from '../components/latest-transaction-skeleton'
import PieChartSkeleton from '../components/pie-chart-skeleton'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { Box, CreditCard, TrendingDown, TrendingUp } from 'lucide-react'
import { BarChart, PieChart } from 'react-feather'
import { DatePickerWithRange } from '@/components/date-picker-with-range'

export default function Overview() {
  const [selectedAccount, setSelectedAccount] = useState({
    id: '',
    balance: 0,
    currency: '#',
  })
  const [filteredIncomes, setFilteredIncomes] = useState<Income[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [filteredDonators, setFilteredDonators] = useState<Income[]>([])
  const [dateRange, setDateRange] = useState<any>(null)
  const [totalIncomeAmount, setTotalIncomeAmount] = useState(0)
  const [totalExpenseAmount, setTotalExpenseAmount] = useState(0)

  // const donators = useDonatorStore((state) => state.donators)
  // const setDonators = useDonatorStore((state) => state.setDonators)

  const incomes = useIncomeStore((state) => state.incomes)
  const setIncomes = useIncomeStore((state) => state.setIncomes)

  const expenses = useExpenseStore((state) => state.expenses)
  const setExpenses = useExpenseStore((state) => state.setExpenses)

  const users = useUserStore((state) => state.users)
  const setUsers = useUserStore((state) => state.setUsers)

  const { data: fetchIncome, loading: incomePending } = useFetchIncome()
  const { data: fetchExpense, loading: expensePending } = useFetchExpense()
  const { data: fetchDonator, loading: donatorPending } = useFetchDonator()

  useEffect(() => {
    if (incomes.length > 0) return
    setIncomes(fetchIncome as Income[])
  }, [fetchIncome])

  useEffect(() => {
    if (expenses.length > 0) return
    setExpenses(fetchExpense as Expense[])
  }, [fetchExpense])

  useEffect(() => {
    const filterTransactions = (transactions: (Income | Expense)[]) => {
      return transactions.filter((transaction) => {
        const createdAt = new Date(transaction.created_at).getTime()
        const from = dateRange?.from
          ? new Date(dateRange.from).getTime()
          : -Infinity
        const to = dateRange?.to
          ? new Date(dateRange.to).setHours(23, 59, 59, 999)
          : Infinity

        return (
          transaction.account.id === selectedAccount.id &&
          createdAt >= from &&
          createdAt <= to &&
          transaction.status === 'APPROVED'
        )
      })
    }

    if (selectedAccount.id && dateRange?.from && dateRange?.to) {
      const filteredIncomes = filterTransactions(incomes)
      const filteredDonators = filteredIncomes.filter(
        (item: any) => item.donator !== null
      )
      setFilteredIncomes(filteredIncomes as Income[])
      setFilteredDonators(filteredDonators as Income[])

      const filteredExpenses = filterTransactions(expenses)
      setFilteredExpenses(filteredExpenses as Expense[])
    } else {
      setFilteredIncomes([])
      setFilteredExpenses([])
    }
  }, [incomes, expenses, selectedAccount.id, dateRange])

  const handleAccountChange = (newState: {
    id: string
    balance: number
    currency: string
  }) => {
    if (
      newState.id !== selectedAccount.id ||
      newState.balance !== selectedAccount.balance ||
      newState.currency !== selectedAccount.currency
    ) {
      setSelectedAccount(newState)
    }
  }

  const handleStateChange = (state: any) => {
    setDateRange(state)
  }

  useEffect(() => {
    const totalIncome = filteredIncomes.reduce(
      (acc, income) => acc + income.amount,
      0
    )
    setTotalIncomeAmount(totalIncome)

    const totalExpense = filteredExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    )
    setTotalExpenseAmount(totalExpense)
  }, [filteredIncomes, filteredExpenses])

  const typedIncomes = filteredIncomes.map((income) => ({
    ...income,
    type: 'income',
  }))

  const typedExpenses = filteredExpenses.map((expense) => ({
    ...expense,
    type: 'expense',
  }))

  const combinedTransactions = [...typedIncomes, ...typedExpenses]

  const latestTransactions = combinedTransactions
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5)

  const summedIncomes = filteredIncomes
    .reduce((acc: { name: string; amount: number }[], income) => {
      const existingCategory = acc.find(
        (item) => item.name === income.category.name
      )

      if (existingCategory) {
        existingCategory.amount += income.amount
      } else {
        acc.push({
          name: income.category.name,
          amount: Number(income.amount),
        })
      }

      return acc
    }, [])
    .sort((a, b) => b.amount - a.amount)
    .map((income, index) => ({
      ...income,
      color: INCOME_COLOR_PALETTE[index % INCOME_COLOR_PALETTE.length],
    }))

  const summedExpenses = filteredExpenses
    .reduce((acc: { name: string; amount: number }[], expense) => {
      const existingCategory = acc.find(
        (item) => item.name === expense.category.name
      )

      if (existingCategory) {
        existingCategory.amount += expense.amount
      } else {
        acc.push({
          name: expense.category.name,
          amount: Number(expense.amount),
        })
      }

      return acc
    }, [])
    .sort((a, b) => b.amount - a.amount)
    .map((expense, index) => ({
      ...expense,
      color: EXPENSE_COLOR_PALETTE[index % EXPENSE_COLOR_PALETTE.length],
    }))

  console.log(fetchIncome)
  console.log(summedIncomes)

  return (
    <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
      <div className='flex items-center justify-between'>
        <div className='hidden items-center space-x-2 md:flex'>
          <AccountSelector onStateChange={handleAccountChange} />
        </div>
        <div className='hidden items-center space-x-2 md:flex'>
          <CalendarDateRangePicker onStateChange={handleStateChange} />
        </div>
      </div>
      <Tabs defaultValue='overview' className='space-y-4'>
        <TabsList>
          <TabsTrigger value='overview'>ພາບລວມ</TabsTrigger>
          <TabsTrigger value='analytics' disabled>
            ການວິເຄາະ
          </TabsTrigger>
        </TabsList>
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <TotalStatusCard
              title='ລາຍຮັບ'
              icon={TrendingUp}
              amount={
                totalIncomeAmount > 0
                  ? `+${selectedAccount.currency}${totalIncomeAmount.toLocaleString()}`
                  : `${selectedAccount.currency}${totalIncomeAmount}`
              }
              className={
                totalIncomeAmount > 0 ? 'text-success' : 'text-foreground'
              }
              isPending={incomePending}
            />
            <TotalStatusCard
              title='ລາຍຈ່າຍ'
              icon={TrendingDown}
              amount={
                totalExpenseAmount < 0
                  ? `-${selectedAccount.currency}${Math.abs(totalExpenseAmount).toLocaleString()}`
                  : `${selectedAccount.currency}${totalExpenseAmount}`
              }
              className={
                totalExpenseAmount < 0 ? 'text-danger' : 'text-foreground'
              }
              isPending={expensePending}
            />
            <TotalStatusCard
              title='ຍອດເງິນໃນບັນຊີ'
              icon={CreditCard}
              amount={`${selectedAccount.currency}${selectedAccount.balance.toLocaleString()}`}
              isPending={incomePending && expensePending}
            />
            <TotalStatusCard
              title='ຈຳນວນຜູ້ບໍລິຈາກ'
              icon={Box}
              amount={`${filteredDonators?.length}` || '0'}
              isPending={donatorPending}
            />
          </div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <Card className='col-span-4'>
              <Tabs defaultValue='pie-chart'>
                <CardHeader>
                  <CardTitle>
                    <TabsList>
                      <TabsTrigger value='pie-chart'>
                        <PieChart size={20} />
                      </TabsTrigger>
                      <TabsTrigger value='bar-chart'>
                        <BarChart size={20} />
                      </TabsTrigger>
                    </TabsList>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TabsContent value='pie-chart' className='space-y-4'>
                    {incomePending || expensePending ? (
                      <PieChartSkeleton />
                    ) : summedIncomes && summedIncomes.length > 0 ? (
                      <IncomeChart
                        data={summedIncomes}
                        currency={selectedAccount.currency}
                      />
                    ) : (
                      <div className='flex-center mt-3 h-28 w-full rounded-md border border-dashed text-foreground/50'>
                        ບໍ່ມີຂໍ້ມູນລາຍຮັບ
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value='bar-chart' className='space-y-4'>
                    {incomePending || expensePending ? (
                      <PieChartSkeleton />
                    ) : summedExpenses && summedExpenses.length > 0 ? (
                      <ExpenseChart
                        data={summedExpenses}
                        currency={selectedAccount.currency}
                      />
                    ) : (
                      <div className='flex-center mt-3 h-28 w-full rounded-md border border-dashed text-foreground/50'>
                        ບໍ່ມີຂໍ້ມູນລາຍຈ່າຍ
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
            <Card className='col-span-4 lg:col-span-3'>
              <CardHeader>
                <CardTitle className='text-xl'>ການເຄື່ອນໄຫວລ່າສຸດ</CardTitle>
                <CardDescription>
                  {`ມີການເຄື່ອນໄຫວທັງໝົດ ${combinedTransactions.length} ລາຍການ`}
                </CardDescription>
              </CardHeader>
              <CardContent className='h-auto'>
                {incomePending || expensePending ? (
                  <LatestTransactionSkeleton />
                ) : latestTransactions.length > 0 ? (
                  latestTransactions.map((transaction) => (
                    <div key={transaction.id} className='my-3'>
                      <div className='flex items-center'>
                        <div className='space-y-1'>
                          <p className='text-base font-medium leading-none'>
                            {transaction.category.name}
                          </p>
                          <p className='text-inter text-sm text-muted-foreground'>
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                        <div
                          className={cn(
                            'text-inter ml-auto text-base font-medium',
                            transaction.type === 'income'
                              ? 'text-success'
                              : 'text-danger'
                          )}
                        >
                          {transaction.type === 'income'
                            ? `+${selectedAccount.currency}${Math.abs(transaction.amount).toLocaleString()}`
                            : `-${selectedAccount.currency}${Math.abs(transaction.amount).toLocaleString()}`}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='flex-center h-28 w-full rounded-md border border-dashed text-foreground/50'>
                    ບໍ່ມີຂໍ້ມູນການເຄື່ອນໄຫວ
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
