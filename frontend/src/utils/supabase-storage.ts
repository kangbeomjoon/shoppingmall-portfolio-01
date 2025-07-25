import { supabase } from '@/lib/supabase'

export async function uploadProductImage(file: File, productId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${productId}-${Date.now()}.${fileExt}`
    const filePath = `product-images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return null
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

export async function deleteProductImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/storage/v1/object/public/products/')
    if (pathParts.length < 2) return false
    
    const filePath = pathParts[1]

    const { error } = await supabase.storage
      .from('products')
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

export async function getProductImageUrl(filePath: string): Promise<string> {
  const { data } = supabase.storage
    .from('products')
    .getPublicUrl(filePath)
  
  return data.publicUrl
}