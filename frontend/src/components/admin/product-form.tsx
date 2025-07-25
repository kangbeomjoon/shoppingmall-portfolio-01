'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUpload } from '@/components/ui/image-upload'
import { useUIStore } from '@/stores/ui-store'
import { Product } from '@/types'

const productSchema = z.object({
  name: z.string().min(1, '상품명을 입력하세요'),
  description: z.string().min(1, '상품 설명을 입력하세요'),
  price: z.number().min(0, '가격은 0원 이상이어야 합니다'),
  stock: z.number().int().min(0, '재고는 0개 이상이어야 합니다'),
  categoryId: z.string().min(1, '카테고리를 선택하세요'),
  imageUrl: z.string().url('올바른 이미지 URL을 입력하세요').optional().or(z.literal(''))
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product
  onSuccess?: () => void
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const router = useRouter()
  const { showToast } = useUIStore()
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '')

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.getCategories()
      return response.data || []
    }
  })

  const createProductMutation = useMutation({
    mutationFn: (data: ProductFormData) => apiClient.createProduct(data),
    onSuccess: () => {
      showToast('상품이 생성되었습니다', 'success')
      onSuccess?.()
      router.push('/admin/products')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      showToast(error.response?.data?.error || '상품 생성에 실패했습니다', 'error')
    }
  })

  const updateProductMutation = useMutation({
    mutationFn: (data: ProductFormData) => apiClient.updateProduct(product!.id, data),
    onSuccess: () => {
      showToast('상품이 수정되었습니다', 'success')
      onSuccess?.()
      router.push('/admin/products')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      showToast(error.response?.data?.error || '상품 수정에 실패했습니다', 'error')
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      categoryId: product?.categoryId || '',
      imageUrl: product?.imageUrl || ''
    }
  })

  const onSubmit = (data: ProductFormData) => {
    const submitData = { ...data, imageUrl }
    if (product) {
      updateProductMutation.mutate(submitData)
    } else {
      createProductMutation.mutate(submitData)
    }
  }

  const handleImageChange = (url: string) => {
    setImageUrl(url)
    setValue('imageUrl', url)
  }

  const isLoading = createProductMutation.isPending || updateProductMutation.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">상품명</Label>
        <Input
          id="name"
          {...register('name')}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">상품 설명</Label>
        <Textarea
          id="description"
          {...register('description')}
          rows={4}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="price">가격</Label>
          <Input
            id="price"
            type="number"
            {...register('price', { valueAsNumber: true })}
            disabled={isLoading}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="stock">재고</Label>
          <Input
            id="stock"
            type="number"
            {...register('stock', { valueAsNumber: true })}
            disabled={isLoading}
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="categoryId">카테고리</Label>
        <Select
          value={product?.categoryId || ''}
          onValueChange={(value) => setValue('categoryId', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="카테고리를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </div>

      <div>
        <Label>상품 이미지</Label>
        <ImageUpload
          value={imageUrl}
          onChange={handleImageChange}
          productId={product?.id}
          disabled={isLoading}
        />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? '처리중...' : product ? '수정' : '생성'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          disabled={isLoading}
        >
          취소
        </Button>
      </div>
    </form>
  )
}