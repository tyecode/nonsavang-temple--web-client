'use server'

import { sst } from '@/lib/select-string'
import { createClient } from '@/utils/supabase/client'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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
