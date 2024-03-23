import { DonutChart, Legend } from '@tremor/react'

const sales = [
  {
    name: 'New York',
    sales: 980,
  },
  {
    name: 'London',
    sales: 456,
  },
  {
    name: 'Hong Kong',
    sales: 390,
  },
  {
    name: 'San Francisco',
    sales: 240,
  },
  {
    name: 'Singapore',
    sales: 190,
  },
]

type DataItem = {
  name: string
  amount: number
  color: string
}

type IncomeChartProps = {
  data: DataItem[]
  currency: string
}

export default function IncomeChart({ data, currency }: IncomeChartProps) {
  const valueFormatter = (number: number) =>
    `${currency}${Intl.NumberFormat('us').format(number).toString()}`

  return (
    <>
      <div className='grid grid-cols-2 gap-8'>
        <DonutChart
          data={data.map((item) => ({ name: item.name, amount: item.amount }))}
          category='amount'
          index='name'
          variant='pie'
          valueFormatter={valueFormatter}
          showAnimation
          showTooltip
          colors={data.map((item) => item.color)}
          className='aspect-square h-full w-full'
        />
        <div className='flex-center h-full w-full flex-col'>
          <div className='flex flex-col gap-1'>
            {data.map((item, index) => (
              <Legend
                key={index}
                categories={[item.name]}
                colors={[item.color]}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
