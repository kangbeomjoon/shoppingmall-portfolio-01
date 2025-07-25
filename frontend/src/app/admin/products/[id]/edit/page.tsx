'use client'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductForm } from '@/components/admin/product-form'
import { Product } from '@/types'

export default function EditProductPage() {
  const params = useParams()
  const productId = params.id as string

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await apiClient.get<Product>(`/products/${productId}`)
      return response.data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>오류</CardTitle>
            <CardDescription>상품을 찾을 수 없습니다</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/products">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                상품 목록으로 돌아가기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            상품 목록으로 돌아가기
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>상품 수정</CardTitle>
          <CardDescription>
            {product.name} 상품 정보를 수정합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm product={product} />
        </CardContent>
      </Card>
    </div>
  )
}