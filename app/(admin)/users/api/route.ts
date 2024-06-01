'use server'

import { createClient } from '@/utils/supabase/client'

export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase.from('user').select('*')

  if (error || !data) {
    return Response.json(
      {
        success: false,
        message: 'Failed to retrieve users. Please try again.',
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
      message: 'Users retrieval was successful.',
      data,
      revalidated: 30,
    },
    {
      status: 200,
    }
  )
}
