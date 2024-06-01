'use server'

import { sst } from '@/lib/select-string'
import { createClient } from '@/utils/supabase/client'

export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('user')
    .select(
      sst([
        'id',
        'email',
        'role',
        'title',
        'first_name',
        'last_name',
        'image',
        'created_at',
        'updated_at',
      ])
    )

  if (error || !data) {
    return Response.json(
      {
        success: false,
        message:
          error?.message || 'Failed to retrieve users. Please try again.',
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
    },
    {
      status: 200,
    }
  )
}
