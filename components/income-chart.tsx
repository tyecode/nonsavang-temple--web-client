import { DonutChart, Legend } from '@tremor/react'

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
  const valueFormatter = (number: number) => {
    const formattedNumber = Intl.NumberFormat('us')
      .format(Math.abs(number))
      .toString()
    const sign = number < 0 ? '-' : '+'
    return `${sign}${currency}${formattedNumber}`
  }
  const totalAmount = data.reduce(
    (total, item) => total + Math.abs(item.amount),
    0
  )

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
              <div key={index} className='flex items-center'>
                <Legend categories={[item.name]} colors={[item.color]} />
                <span className='text-center'>{`(${((Math.abs(item.amount) / totalAmount) * 100).toFixed(0)}%)`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
