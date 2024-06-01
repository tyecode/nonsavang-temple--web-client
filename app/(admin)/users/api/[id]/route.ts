'use server'

import { createClient } from '@/utils/supabase/client'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('user')
    .select('*')
    .eq('id', params.id)

  if (error || !data) {
    return Response.json(
      {
        success: false,
        message: 'Failed to retrieve user. Please try again.',
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
      message: 'User retrieval was successful.',
      data,
      revalidated: 30,
    },
    {
      status: 200,
    }
  )
}
