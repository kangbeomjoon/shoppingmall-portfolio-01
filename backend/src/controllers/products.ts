import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/db';
import { ApiResponse, PaginatedResponse, ProductFilters } from '../types';

const productQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  categoryId: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  search: z.string().optional(),
  sortBy: z.enum(['price', 'name', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = productQuerySchema.safeParse(req.query);
    
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
      });
      return;
    }

    const { page, limit, categoryId, minPrice, maxPrice, search, sortBy, sortOrder } = validation.data;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: ApiResponse<PaginatedResponse<typeof products[0]>> = {
      success: true,
      data: {
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: id! },
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

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: product,
    };

    res.json(response);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
      return;
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
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

    const response: ApiResponse = {
      success: true,
      data: products,
    };

    res.json(response);
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
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

    const response: ApiResponse = {
      success: true,
      data: products,
    };

    res.json(response);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};