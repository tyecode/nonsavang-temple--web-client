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
import { useExpenseStore, useIncomeStore } from '@/stores'
import { Expense, Income } from '@/types'
import { useEffect, useState } from 'react'

import LatestTransactionSkeleton from '../latest-transaction-skeleton'
import PieChartSkeleton from '../pie-chart-skeleton'
import { Box, CreditCard, TrendingDown, TrendingUp } from 'lucide-react'
import { BarChart, PieChart } from 'react-feather'
import { PieChartData } from '@/components/pie-chart-data'

export default function Overview({ isPending }: { isPending: boolean }) {
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

  const incomes = useIncomeStore((state) => state.incomes)
  const expenses = useExpenseStore((state) => state.expenses)

  const filterTransactions = (
    transactions: (Income | Expense)[],
    account: string,
    range: any
  ) => {
    return transactions.filter((transaction) => {
      const createdAt = new Date(transaction.created_at).getTime()
      const from = new Date(range?.from ?? -Infinity).getTime()
      const to = range?.to
        ? new Date(range.to).setHours(23, 59, 59, 999)
        : Infinity

      return (
        transaction.account.id === account &&
        createdAt >= from &&
        createdAt <= to &&
        transaction.status === 'APPROVED'
      )
    })
  }

  useEffect(() => {
    if (selectedAccount.id && dateRange?.from && dateRange?.to) {
      const filteredIncomes = filterTransactions(
        incomes,
        selectedAccount.id,
        dateRange
      )
      const filteredDonators = filteredIncomes.filter(
        (item: any) => item.donator !== null
      )
      setFilteredIncomes(filteredIncomes as Income[])
      setFilteredDonators(filteredDonators as Income[])

      const filteredExpenses = filterTransactions(
        expenses,
        selectedAccount.id,
        dateRange
      )
      setFilteredExpenses(filteredExpenses as Expense[])

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
    if (JSON.stringify(newState) !== JSON.stringify(selectedAccount)) {
      setSelectedAccount(newState)
    }
  }

  const handleStateChange = (state: any) => {
    setDateRange(state)
  }

  const combinedTransactions = [
    ...filteredIncomes.map((income) => ({ ...income, type: 'income' })),
    ...filteredExpenses.map((expense) => ({ ...expense, type: 'expense' })),
  ]

  const latestTransactions = combinedTransactions
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5)

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
              isPending={isPending}
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
              isPending={isPending}
            />
            <TotalStatusCard
              title='ຍອດເງິນໃນບັນຊີ'
              icon={CreditCard}
              amount={`${selectedAccount.currency}${selectedAccount.balance.toLocaleString()}`}
              isPending={isPending}
            />
            <TotalStatusCard
              title='ຈຳນວນຜູ້ບໍລິຈາກ'
              icon={Box}
              amount={`${filteredDonators?.length}` || '0'}
              isPending={isPending}
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
                      <TabsTrigger disabled value='bar-chart'>
                        <BarChart size={20} />
                      </TabsTrigger>
                    </TabsList>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TabsContent value='pie-chart' className='space-y-4'>
                    {isPending ? (
                      <PieChartSkeleton />
                    ) : totalIncomeAmount > 0 || totalExpenseAmount > 0 ? (
                      <PieChartData
                        data={[
                          {
                            name: 'ລາຍຮັບ',
                            amount: totalIncomeAmount,
                            color: 'green',
                          },
                          {
                            name: 'ລາຍຈ່າຍ',
                            amount: totalExpenseAmount,
                            color: 'red',
                          },
                        ]}
                        currency={selectedAccount.currency}
                      />
                    ) : (
                      <div className='flex-center mt-3 h-28 w-full rounded-md border border-dashed text-foreground/50'>
                        ບໍ່ມີຂໍ້ມູນລາຍຮັບ-ລາຍຈ່າຍ
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent
                    value='bar-chart'
                    className='space-y-4'
                  ></TabsContent>
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
                {isPending ? (
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
