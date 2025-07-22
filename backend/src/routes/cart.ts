import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart';

const router = Router();

// 모든 장바구니 라우트는 인증이 필요합니다
router.get('/', authenticate, getCart);
router.post('/', authenticate, addToCart);
router.put('/:id', authenticate, updateCartItem);
router.delete('/clear', authenticate, clearCart); // 장바구니 전체 비우기
router.delete('/:id', authenticate, removeFromCart);

export default router;