import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/db';
import { ApiResponse, PaginatedResponse } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Product description is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  stock: z.number().int().min(0, 'Stock must be non-negative'),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url().optional(),
});

const updateProductSchema = createProductSchema.partial();

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

export const getFeaturedProducts = async (_req: Request, res: Response): Promise<void> => {
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

// Admin CRUD operations
export const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validation = createProductSchema.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid product data',
        details: validation.error.errors,
      });
      return;
    }

    const productData = validation.data;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: productData.categoryId },
    });

    if (!category) {
      res.status(400).json({
        success: false,
        error: 'Category not found',
      });
      return;
    }

    // Filter out undefined values
    const cleanData = Object.fromEntries(
      Object.entries(productData).filter(([, value]) => value !== undefined)
    );

    const product = await prisma.product.create({
      data: cleanData as any,
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

    const response: ApiResponse = {
      success: true,
      data: product,
      message: 'Product created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const validation = updateProductSchema.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid product data',
        details: validation.error.errors,
      });
      return;
    }

    const updateData = validation.data;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    // Check if category exists (if being updated)
    if (updateData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: updateData.categoryId },
      });

      if (!category) {
        res.status(400).json({
          success: false,
          error: 'Category not found',
        });
        return;
      }
    }

    // Filter out undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined)
    );

    const product = await prisma.product.update({
      where: { id },
      data: cleanUpdateData as any,
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

    const response: ApiResponse = {
      success: true,
      data: product,
      message: 'Product updated successfully',
    };

    res.json(response);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params as { id: string };

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    await prisma.product.delete({
      where: { id },
    });

    const response: ApiResponse = {
      success: true,
      message: 'Product deleted successfully',
    };

    res.json(response);
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};