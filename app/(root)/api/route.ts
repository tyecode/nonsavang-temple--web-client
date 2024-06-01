import { createClient } from '@/utils/supabase/client'

export async function GET(request: Request) {
  return Response.json({ data: 'testing' })
}
