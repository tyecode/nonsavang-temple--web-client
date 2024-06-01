'use server'

import { createClient } from '@/utils/supabase/client'
import { NextRequest } from 'next/server'

const supabase = createClient()

export async function GET() {
  const { data, error } = await supabase.from('expense').select(
    `*, 
    category: category_id (*), 
    currency: currency_id (*), 
    user: user_id (*), 
    account: account_id (*, currency: currency_id (*)), 
    drawer: drawer_id (*)`
  )

  if (error || !data) {
    return Response.json(
      {
        success: false,
        message: 'Failed to retrieve expenses. Please try again.',
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
      data,
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
      `*, 
      category: category_id (*), 
      currency: currency_id (*), 
      user: user_id (*), 
      account: account_id (*, currency: currency_id (*)), 
      drawer: drawer_id (*)`
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
