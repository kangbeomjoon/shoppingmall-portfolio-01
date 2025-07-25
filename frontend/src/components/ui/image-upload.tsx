'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { uploadProductImage, deleteProductImage } from '@/utils/supabase-storage'

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  productId?: string
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  productId,
  disabled,
  className
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setIsUploading(true)
      setUploadError(null)

      try {
        // 임시 productId 생성 (실제로는 상품 생성 시 사용)
        const tempProductId = productId || `temp-${Date.now()}`
        const url = await uploadProductImage(file, tempProductId)

        if (url) {
          // 기존 이미지가 있으면 삭제
          if (value && value.includes('supabase')) {
            await deleteProductImage(value)
          }
          onChange(url)
        } else {
          setUploadError('이미지 업로드에 실패했습니다.')
        }
      } catch (error) {
        console.error('Upload error:', error)
        setUploadError('이미지 업로드 중 오류가 발생했습니다.')
      } finally {
        setIsUploading(false)
      }
    },
    [value, onChange, productId]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: disabled || isUploading
  })

  const handleRemove = async () => {
    if (value && value.includes('supabase')) {
      await deleteProductImage(value)
    }
    onChange('')
  }

  return (
    <div className={cn('space-y-4', className)}>
      {value ? (
        <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-lg border">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'relative aspect-square w-full max-w-sm cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-colors',
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300',
            isUploading && 'cursor-not-allowed opacity-50'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            {isUploading ? (
              <>
                <Upload className="mb-4 h-10 w-10 animate-pulse text-gray-400" />
                <p className="text-sm text-gray-600">업로드 중...</p>
              </>
            ) : (
              <>
                <ImageIcon className="mb-4 h-10 w-10 text-gray-400" />
                <p className="text-sm font-medium text-gray-700">
                  클릭하거나 이미지를 드래그하세요
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF, WEBP (최대 10MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}
      {uploadError && (
        <p className="text-sm text-red-600">{uploadError}</p>
      )}
    </div>
  )
}