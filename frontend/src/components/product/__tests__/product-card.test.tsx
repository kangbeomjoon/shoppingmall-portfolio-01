import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard, ProductGrid } from '../product-card'
import { Product } from '@/types'

// Mock the cart store
const mockAddItem = jest.fn()
jest.mock('@/stores/cart-store', () => ({
  useCartStore: () => ({
    addItem: mockAddItem,
  }),
}))

// Mock the utils
jest.mock('@/lib/utils', () => ({
  formatPrice: (price: number) => `$${price.toFixed(2)}`,
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
})

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test product description',
    price: 99.99,
    stock: 10,
    imageUrl: 'https://example.com/image.jpg',
    category: {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
    },
    categoryId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('Test product description')).toBeInTheDocument()
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('재고: 10개')).toBeInTheDocument()
    expect(screen.getByText('Electronics')).toBeInTheDocument()
  })

  it('displays placeholder when no image URL is provided', () => {
    const productWithoutImage = { ...mockProduct, imageUrl: undefined }
    render(<ProductCard product={productWithoutImage} />)

    expect(screen.getByText('이미지 없음')).toBeInTheDocument()
  })

  it('shows out of stock badge when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStockProduct} />)

    expect(screen.getByText('품절')).toBeInTheDocument()
  })

  it('disables add to cart button when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStockProduct} />)

    const addToCartButton = screen.getByRole('button', { name: /shopping cart/i })
    expect(addToCartButton).toBeDisabled()
  })

  it('adds product to cart when cart button is clicked', async () => {
    const user = userEvent.setup()
    render(<ProductCard product={mockProduct} />)

    const addToCartButton = screen.getByRole('button', { name: /shopping cart/i })
    await user.click(addToCartButton)

    expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 1)
  })

  it('prevents event propagation when cart button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnClick = jest.fn()
    
    render(
      <div onClick={mockOnClick}>
        <ProductCard product={mockProduct} />
      </div>
    )

    const addToCartButton = screen.getByRole('button', { name: /shopping cart/i })
    await user.click(addToCartButton)

    // The parent onClick should not be called due to stopPropagation
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('toggles like state when heart button is clicked', async () => {
    const user = userEvent.setup()
    render(<ProductCard product={mockProduct} />)

    const likeButton = screen.getByRole('button', { name: /heart/i })
    
    // Initially not liked
    const heartIcon = likeButton.querySelector('svg')
    expect(heartIcon).not.toHaveClass('fill-red-500', 'text-red-500')

    // Click to like
    await user.click(likeButton)
    
    await waitFor(() => {
      expect(heartIcon).toHaveClass('fill-red-500', 'text-red-500')
    })
  })

  it('shows loading state when adding to cart', async () => {
    const user = userEvent.setup()
    render(<ProductCard product={mockProduct} />)

    const addToCartButton = screen.getByRole('button', { name: /shopping cart/i })
    
    // Click add to cart
    fireEvent.click(addToCartButton)

    // Should show loading spinner
    expect(screen.getByRole('button', { name: /shopping cart/i })).toBeDisabled()
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /shopping cart/i })).not.toBeDisabled()
    }, { timeout: 1000 })
  })

  it('applies custom className', () => {
    render(<ProductCard product={mockProduct} className="custom-class" />)
    
    const link = screen.getByRole('link')
    const card = link.firstChild as HTMLElement
    expect(card).toHaveClass('custom-class')
  })

  it('handles image load error', () => {
    render(<ProductCard product={mockProduct} />)
    
    const image = screen.getByRole('img', { name: /test product/i })
    
    // Simulate image error
    fireEvent.error(image)
    
    expect(screen.getByText('이미지 없음')).toBeInTheDocument()
  })

  it('creates correct product link', () => {
    render(<ProductCard product={mockProduct} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/products/1')
  })
})

describe('ProductGrid', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      price: 99.99,
      stock: 10,
      imageUrl: 'https://example.com/image1.jpg',
      category: { id: '1', name: 'Electronics', slug: 'electronics' },
      categoryId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      price: 149.99,
      stock: 5,
      imageUrl: 'https://example.com/image2.jpg',
      category: { id: '2', name: 'Clothing', slug: 'clothing' },
      categoryId: '2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  it('renders all products in grid', () => {
    render(<ProductGrid products={mockProducts} />)

    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
  })

  it('applies grid layout classes', () => {
    const { container } = render(<ProductGrid products={mockProducts} />)
    
    const grid = container.firstChild as HTMLElement
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-4',
      'gap-6'
    )
  })

  it('applies custom className to grid', () => {
    const { container } = render(<ProductGrid products={mockProducts} className="custom-grid" />)
    
    const grid = container.firstChild as HTMLElement
    expect(grid).toHaveClass('custom-grid')
  })

  it('renders empty grid when no products provided', () => {
    const { container } = render(<ProductGrid products={[]} />)
    
    const grid = container.firstChild as HTMLElement
    expect(grid).toBeInTheDocument()
    expect(grid.children).toHaveLength(0)
  })
})