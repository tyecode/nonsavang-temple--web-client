'use server'

import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export async function GET() {
  const { data, error } = await supabase.from('donator').select('*')

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
      message: 'Donators retrieval was successful.',
      data,
    },
    {
      status: 200,
    }
  )
}
