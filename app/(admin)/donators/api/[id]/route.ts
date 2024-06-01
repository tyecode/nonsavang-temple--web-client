'use server'

import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from('donator')
    .select('*')
    .eq('id', params.id)

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
      message: 'Donator retrieval was successful.',
      data,
      revalidated: 30,
    },
    {
      status: 200,
    }
  )
}
