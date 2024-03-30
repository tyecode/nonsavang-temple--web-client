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
import { ScrollArea } from '@/components/ui/scroll-area'
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
import IncomeChart from '../income-chart'
import { useFetchDonator, useFetchExpense, useFetchIncome } from '@/hooks'
import {
  INCOME_COLOR_PALETTE,
  EXPENSE_COLOR_PALETTE,
} from '@/constants/color-palette'
import ExpenseChart from '../expense-chart'
import LatestTransactionSkeleton from '../latest-transaction-skeleton'
import PieChartSkeleton from '../pie-chart-skeleton'
import { useTransactionStore } from '@/stores/useTransactionStore'

export default function OverviewPage() {
  const [selectedAccount, setSelectedAccount] = useState({ id: '', balance: 0 })
  const [currencySymbol, setCurrencySymbol] = useState<string>('')
  const [filteredIncomes, setFilteredIncomes] = useState<Income[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])

  const donators = useDonatorStore((state) => state.donators)
  const setDonators = useDonatorStore((state) => state.setDonators)

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
    if (donators.length > 0) return
    setDonators(fetchDonator as Donator[])
  }, [fetchDonator])

  useEffect(() => {
    if (selectedAccount.id) {
      const incomeResult = incomes.filter(
        (income: Income) => income.account.id === selectedAccount.id
      )
      setFilteredIncomes(incomeResult)

      const expenseResult = expenses.filter(
        (expense: Expense) => expense.account.id === selectedAccount.id
      )
      setFilteredExpenses(expenseResult)

      if (expenseResult.length > 0 && expenseResult[0].currency) {
        setCurrencySymbol(expenseResult[0].currency.symbol)
      }
    }
  }, [incomes, expenses, selectedAccount.id])

  const handleAccountChange = (newState: { id: string; balance: number }) => {
    if (
      newState.id !== selectedAccount.id ||
      newState.balance !== selectedAccount.balance
    ) {
      setSelectedAccount(newState)
    }
  }

  const handleDatePickerChange = (state: any) => {
    console.log(state)
  }

  const totalIncomeAmount = filteredIncomes.reduce(
    (acc, income) => acc + income.amount,
    0
  )

  const totalExpenseAmount = filteredExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  )

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

  return (
    <ScrollArea className='h-full'>
      <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
        <div className='flex items-center justify-between'>
          <div className='hidden items-center space-x-2 md:flex'>
            <AccountSelector onStateChange={handleAccountChange} />
          </div>
          <div className='hidden items-center space-x-2 md:flex'>
            <CalendarDateRangePicker onStateChange={handleDatePickerChange} />
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
                icon='trending-up-icon'
                amount={
                  totalIncomeAmount > 0
                    ? `+${currencySymbol}${totalIncomeAmount.toLocaleString()}`
                    : `${currencySymbol}${totalIncomeAmount}`
                }
                className={
                  totalIncomeAmount > 0 ? 'text-success' : 'text-foreground'
                }
                isPending={incomePending}
              />
              <TotalStatusCard
                title='ລາຍຈ່າຍ'
                icon='trending-down-icon'
                amount={
                  totalExpenseAmount > 0
                    ? `-${currencySymbol}${totalExpenseAmount.toLocaleString()}`
                    : `${currencySymbol}${totalExpenseAmount}`
                }
                className={
                  totalExpenseAmount > 0 ? 'text-danger' : 'text-foreground'
                }
                isPending={expensePending}
              />
              <TotalStatusCard
                title='ຍອດເງິນໃນບັນຊີ'
                icon='credit-card-icon'
                amount={`${currencySymbol}${selectedAccount.balance.toLocaleString()}`}
                isPending={incomePending && expensePending}
              />
              <TotalStatusCard
                title='ຈຳນວນຜູ້ບໍລິຈາກ'
                icon='archive-icon'
                amount={`${donators?.length}` || '0'}
                isPending={donatorPending}
              />
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
              <Card className='col-span-4'>
                <Tabs defaultValue='income'>
                  <CardHeader>
                    <CardTitle>
                      <TabsList>
                        <TabsTrigger value='income'>ລາຍຮັບ</TabsTrigger>
                        <TabsTrigger value='expense'>ລາຍຈ່າຍ</TabsTrigger>
                      </TabsList>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TabsContent value='income' className='space-y-4'>
                      {incomePending || expensePending ? (
                        <PieChartSkeleton />
                      ) : summedIncomes && summedIncomes.length > 0 ? (
                        <IncomeChart
                          data={summedIncomes}
                          currency={currencySymbol}
                        />
                      ) : (
                        <div className='flex-center mt-3 h-28 w-full rounded-md border border-dashed text-foreground/50'>
                          ບໍ່ມີຂໍ້ມູນລາຍຮັບ
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value='expense' className='space-y-4'>
                      {incomePending || expensePending ? (
                        <PieChartSkeleton />
                      ) : summedExpenses && summedExpenses.length > 0 ? (
                        <ExpenseChart
                          data={summedExpenses}
                          currency={currencySymbol}
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
                              ? `+${currencySymbol}${transaction.amount.toLocaleString()}`
                              : `-${currencySymbol}${transaction.amount.toLocaleString()}`}
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
    </ScrollArea>
  )
}
