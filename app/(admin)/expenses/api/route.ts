'use server'

import { sst } from '@/lib/select-string'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export async function GET() {
  const { data, error } = await supabase
    .from('expense')
    .select(
      sst([
        '*',
        'category: category_id (*)',
        'currency: currency_id (*)',
        'user: user_id (*)',
        'account: account_id (*, currency: currency_id (*))',
        'drawer: drawer_id (*)',
      ])
    )

  if (error || !data) {
    return Response.json(
      {
        success: false,
        message:
          error?.message || 'Failed to retrieve expenses. Please try again.',
        data: null,
      },
      {
        status: 404,
      }
    )
  }

  return Response.json(
    {
      success: true,
      message: 'Expenses retrieval was successful.',
      data: data.map((item: any) => ({ ...item, __typename: 'Expense' })),
    },
    {
      status: 200,
    }
  )
}

export async function POST(req: Request) {
  const body = await req.json()

  const { data, error } = await supabase
    .from('expense')
    .insert(body)
    .select(
      sst([
        '*',
        'category: category_id (*)',
        'currency: currency_id (*)',
        'user: user_id (*)',
        'account: account_id (*, currency: currency_id (*))',
        'drawer: drawer_id (*)',
      ])
    )

  if (error || !data) {
    return Response.json(
      {
        success: false,
        message:
          error?.message || 'Failed to create expense. Please try again.',
        data: null,
      },
      {
        status: 404,
      }
    )
  }

  return Response.json(
    {
      success: true,
      message: 'Expense creation was successful.',
      data,
    },
    {
      status: 200,
    }
  )
}
