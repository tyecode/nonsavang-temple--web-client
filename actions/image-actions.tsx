import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!
)

export const uploadImage = async (file: File) => {
  const bucket = 'images'
  const timestamp = Date.now()

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`abbeyard-${timestamp}-${file.name}`, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Image upload failed:', error)
    return {
      data: null,
      error,
      message: 'Failed to upload the image',
    }
  }

  return {
    data,
    error: null,
    message: 'Image was uploaded successfully.',
  }
}

export const deleteImage = async (key: string) => {
  const bucket = 'images'

  const { data, error } = await supabase.storage.from(bucket).remove([key])

  if (error) {
    console.error('Image delete failed:', error)
    return {
      data: null,
      error,
      message: 'Failed to delete the image',
    }
  }

  return {
    data,
    error: null,
    message: 'Image was deleted successfully.',
  }
}
