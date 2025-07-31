import { Request, Response } from 'express';
import { getCategories, getCategoryById, getCategoryBySlug } from '@/controllers/categories';
import prisma from '@/lib/db';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Categories Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getCategories', () => {
    const mockCategories = [
      {
        id: 'category-1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices',
        _count: {
          products: 10,
        },
      },
      {
        id: 'category-2',
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and clothing',
        _count: {
          products: 5,
        },
      },
    ];

    it('should get all categories successfully', async () => {
      (mockedPrisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

      await getCategories(req as Request, res as Response);

      expect(mockedPrisma.category.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCategories,
      });
    });

    it('should handle database errors', async () => {
      (mockedPrisma.category.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getCategories(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('getCategoryById', () => {
    const mockCategory = {
      id: 'category-1',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices',
      products: [
        {
          id: 'product-1',
          name: 'iPhone 14',
          price: 999,
        },
      ],
      _count: {
        products: 15,
      },
    };

    it('should get category by id successfully', async () => {
      req.params = { id: 'category-1' };
      (mockedPrisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);

      await getCategoryById(req as Request, res as Response);

      expect(mockedPrisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: 'category-1' },
        include: {
          products: {
            take: 10,
            orderBy: {
              createdAt: 'desc',
            },
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCategory,
      });
    });

    it('should return 404 when category not found', async () => {
      req.params = { id: 'non-existent' };
      (mockedPrisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      await getCategoryById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Category not found',
      });
    });

    it('should handle database errors', async () => {
      req.params = { id: 'category-1' };
      (mockedPrisma.category.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getCategoryById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('getCategoryBySlug', () => {
    const mockCategory = {
      id: 'category-1',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices',
      products: [
        {
          id: 'product-1',
          name: 'iPhone 14',
          price: 999,
        },
      ],
      _count: {
        products: 15,
      },
    };

    it('should get category by slug successfully', async () => {
      req.params = { slug: 'electronics' };
      (mockedPrisma.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);

      await getCategoryBySlug(req as Request, res as Response);

      expect(mockedPrisma.category.findUnique).toHaveBeenCalledWith({
        where: { slug: 'electronics' },
        include: {
          products: {
            take: 10,
            orderBy: {
              createdAt: 'desc',
            },
          },
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCategory,
      });
    });

    it('should return 404 when category not found by slug', async () => {
      req.params = { slug: 'non-existent' };
      (mockedPrisma.category.findUnique as jest.Mock).mockResolvedValue(null);

      await getCategoryBySlug(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Category not found',
      });
    });

    it('should handle database errors', async () => {
      req.params = { slug: 'electronics' };
      (mockedPrisma.category.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getCategoryBySlug(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });
});