'use server'

import { sst } from '@/lib/select-string'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()

  const { data, error } = await supabase
    .from('expense')
    .update(body)
    .eq('id', params.id)
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
          error?.message || 'Failed to update expense. Please try again.',
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
      message: 'Expense update was successful.',
      data,
    },
    {
      status: 200,
    }
  )
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from('expense')
    .delete()
    .eq('id', params.id)
    .select()

  if (error || !data) {
    return Response.json(
      {
        success: false,
        message:
          error?.message || 'Failed to delete expense. Please try again.',
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
      message: 'Expense deletion was successful.',
      data,
    },
    {
      status: 200,
    }
  )
}
