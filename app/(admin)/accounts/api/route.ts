'use server'

import { createClient } from '@/utils/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('account')
    .select('*, user: user_id (*), currency: currency_id (*)')

  if (error || !data) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve accounts. Please try again.',
        data: null,
      },
      {
        status: 404,
      }
    )
  }

  return NextResponse.json(
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
