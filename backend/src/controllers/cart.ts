import { Response } from 'express';
import prisma from '../lib/db';
import { AuthenticatedRequest } from '../types';

export const getCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 총 금액 계산
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      success: true,
      data: {
        items: cartItems,
        totalAmount,
        totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId, quantity = 1 } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    if (!productId || quantity < 1) {
      res.status(400).json({
        success: false,
        error: 'Invalid product or quantity',
      });
      return;
    }

    // 상품 존재 확인 및 재고 확인
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).json({
        success: false,
        error: 'Insufficient stock',
      });
      return;
    }

    // 이미 장바구니에 있는지 확인
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
      },
    });

    let cartItem;

    if (existingItem) {
      // 기존 항목 수량 업데이트
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        res.status(400).json({
          success: false,
          error: 'Insufficient stock for requested quantity',
        });
        return;
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
    } else {
      // 새 항목 추가
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
    }

    res.json({
      success: true,
      data: cartItem,
      message: '장바구니에 추가되었습니다',
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const updateCartItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    if (!quantity || quantity < 1) {
      res.status(400).json({
        success: false,
        error: 'Invalid quantity',
      });
      return;
    }

    // 장바구니 항목 확인
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: id!,
        userId,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      res.status(404).json({
        success: false,
        error: 'Cart item not found',
      });
      return;
    }

    // 재고 확인
    if (cartItem.product.stock < quantity) {
      res.status(400).json({
        success: false,
        error: 'Insufficient stock',
      });
      return;
    }

    // 수량 업데이트
    const updatedItem = await prisma.cartItem.update({
      where: { id: id! },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: updatedItem,
      message: '수량이 업데이트되었습니다',
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const removeFromCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    // 장바구니 항목 확인
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: id!,
        userId,
      },
    });

    if (!cartItem) {
      res.status(404).json({
        success: false,
        error: 'Cart item not found',
      });
      return;
    }

    // 삭제
    await prisma.cartItem.delete({
      where: { id: id! },
    });

    res.json({
      success: true,
      message: '장바구니에서 제거되었습니다',
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    // 모든 장바구니 항목 삭제
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    res.json({
      success: true,
      message: '장바구니가 비워졌습니다',
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};