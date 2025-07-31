import { Request, Response } from 'express';
import { getProducts, getProductById, searchProducts, getFeaturedProducts } from '@/controllers/products';
import prisma from '@/lib/db';
import { AuthenticatedRequest } from '@/middleware/auth';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Products Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getProducts', () => {
    const mockProducts = [
      {
        id: 'product-1',
        name: 'Test Product 1',
        description: 'Test Description 1',
        price: 100,
        stock: 10,
        categoryId: 'category-1',
        category: {
          id: 'category-1',
          name: 'Test Category',
          slug: 'test-category',
        },
      },
      {
        id: 'product-2',
        name: 'Test Product 2',
        description: 'Test Description 2',
        price: 200,
        stock: 20,
        categoryId: 'category-1',
        category: {
          id: 'category-1',
          name: 'Test Category',
          slug: 'test-category',
        },
      },
    ];

    it('should get products with default pagination', async () => {
      (mockedPrisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
      (mockedPrisma.product.count as jest.Mock).mockResolvedValue(2);

      await getProducts(req as Request, res as Response);

      expect(mockedPrisma.product.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: 0,
        take: 20,
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          data: mockProducts,
          pagination: {
            page: 1,
            limit: 20,
            total: 2,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        },
      });
    });

    it('should filter products by category', async () => {
      req.query = { categoryId: 'category-1' };
      (mockedPrisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
      (mockedPrisma.product.count as jest.Mock).mockResolvedValue(2);

      await getProducts(req as Request, res as Response);

      expect(mockedPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { categoryId: 'category-1' },
        })
      );
    });

    it('should filter products by price range', async () => {
      req.query = { minPrice: '50', maxPrice: '150' };
      (mockedPrisma.product.findMany as jest.Mock).mockResolvedValue([mockProducts[0]]);
      (mockedPrisma.product.count as jest.Mock).mockResolvedValue(1);

      await getProducts(req as Request, res as Response);

      expect(mockedPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { price: { gte: 50, lte: 150 } },
        })
      );
    });

    it('should search products by name or description', async () => {
      req.query = { search: 'Test' };
      (mockedPrisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
      (mockedPrisma.product.count as jest.Mock).mockResolvedValue(2);

      await getProducts(req as Request, res as Response);

      expect(mockedPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'Test', mode: 'insensitive' } },
              { description: { contains: 'Test', mode: 'insensitive' } },
            ],
          },
        })
      );
    });

    it('should handle pagination correctly', async () => {
      req.query = { page: '2', limit: '10' };
      (mockedPrisma.product.findMany as jest.Mock).mockResolvedValue([]);
      (mockedPrisma.product.count as jest.Mock).mockResolvedValue(25);

      await getProducts(req as Request, res as Response);

      expect(mockedPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      );

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          data: [],
          pagination: {
            page: 2,
            limit: 10,
            total: 25,
            totalPages: 3,
            hasNextPage: true,
            hasPrevPage: true,
          },
        },
      });
    });

    it('should sort products by price ascending', async () => {
      req.query = { sortBy: 'price', sortOrder: 'asc' };
      (mockedPrisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);
      (mockedPrisma.product.count as jest.Mock).mockResolvedValue(2);

      await getProducts(req as Request, res as Response);

      expect(mockedPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            price: 'asc',
          },
        })
      );
    });

    it('should return 400 for invalid query parameters', async () => {
      req.query = { sortBy: 'invalid' };

      await getProducts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid query parameters',
      });
    });

    it('should handle database errors', async () => {
      (mockedPrisma.product.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getProducts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('getProductById', () => {
    const mockProduct = {
      id: 'product-1',
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      categoryId: 'category-1',
      category: {
        id: 'category-1',
        name: 'Test Category',
        slug: 'test-category',
      },
    };

    it('should get product by id successfully', async () => {
      req.params = { id: 'product-1' };
      (mockedPrisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

      await getProductById(req as Request, res as Response);

      expect(mockedPrisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
      });
    });

    it('should return 404 when product not found', async () => {
      req.params = { id: 'non-existent' };
      (mockedPrisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await getProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Product not found',
      });
    });

    it('should handle database errors', async () => {
      req.params = { id: 'product-1' };
      (mockedPrisma.product.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('searchProducts', () => {
    const mockProducts = [
      {
        id: 'product-1',
        name: 'iPhone 14',
        description: 'Latest iPhone model',
        category: { id: 'cat-1', name: 'Electronics', slug: 'electronics' },
      },
    ];

    it('should search products successfully', async () => {
      req.query = { q: 'iPhone' };
      (mockedPrisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      await searchProducts(req as Request, res as Response);

      expect(mockedPrisma.product.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'iPhone', mode: 'insensitive' } },
            { description: { contains: 'iPhone', mode: 'insensitive' } },
          ],
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        take: 10,
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProducts,
      });
    });

    it('should return 400 when search query is missing', async () => {
      req.query = {};

      await searchProducts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Search query is required',
      });
    });

    it('should return 400 when search query is not a string', async () => {
      req.query = { q: ['array', 'value'] as any };

      await searchProducts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Search query is required',
      });
    });

    it('should handle database errors', async () => {
      req.query = { q: 'iPhone' };
      (mockedPrisma.product.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await searchProducts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('getFeaturedProducts', () => {
    const mockProducts = [
      {
        id: 'product-1',
        name: 'Featured Product 1',
        description: 'Featured item',
        category: { id: 'cat-1', name: 'Electronics', slug: 'electronics' },
      },
      {
        id: 'product-2',
        name: 'Featured Product 2',
        description: 'Another featured item',
        category: { id: 'cat-1', name: 'Electronics', slug: 'electronics' },
      },
    ];

    it('should get featured products successfully', async () => {
      (mockedPrisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      await getFeaturedProducts({} as Request, res as Response);

      expect(mockedPrisma.product.findMany).toHaveBeenCalledWith({
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 8,
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProducts,
      });
    });

    it('should handle database errors', async () => {
      (mockedPrisma.product.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getFeaturedProducts({} as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });
});