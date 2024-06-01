'use server'

import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export async function GET() {
  const { data, error } = await supabase.from('income').select(
    `*, 
    category: category_id (*), 
    user: user_id (*), 
    account: account_id (*, currency: currency_id (*)), 
    currency: currency_id (*), 
    donator: donator_id (*)`
  )

  if (error || !data) {
    return Response.json(
      {
        success: false,
        message:
          error?.message || 'Failed to retrieve incomes. Please try again.',
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
      message: 'Incomes retrieval was successful.',
      data,
      revalidated: 30,
    },
    {
      status: 200,
    }
  )
}

export async function POST(req: Request) {
  const body = await req.json()

  const { data, error } = await supabase
    .from('income')
    .insert(body)
    .select(
      `*, 
      category: category_id (*), 
      user: user_id (*), 
      account: account_id (*, currency: currency_id (*)), 
      currency: currency_id (*), 
      donator: donator_id (*)`
    )

  if (error || !data) {
    return Response.json(
      {
        success: false,
        message: error?.message || 'Failed to create income. Please try again.',
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
      message: 'Income creation was successful.',
      data,
    },
    {
      status: 200,
    }
  )
}
