'use server'

import { sst } from '@/lib/select-string'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export async function GET() {
  const { data, error } = await supabase
    .from('account')
    .select(sst(['*', 'user: user_id (*)', 'currency: currency_id (*)']))

  if (error || !data) {
    return Response.json(
      {
        success: false,
        message: error?.message,
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
      message: 'Accounts retrieval was successful.',
      data,
    },
    {
      status: 200,
    }
  )
}
