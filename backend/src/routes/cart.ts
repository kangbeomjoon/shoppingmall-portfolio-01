import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// 일시적으로 기본 응답 제공 (추후 구현 예정)
router.get('/', authenticate, (req, res) => {
  res.json({ success: true, data: [], message: 'Cart endpoint - coming soon' });
});

router.post('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'Add to cart endpoint - coming soon' });
});

router.put('/:id', authenticate, (req, res) => {
  res.json({ success: true, message: 'Update cart endpoint - coming soon' });
});

router.delete('/:id', authenticate, (req, res) => {
  res.json({ success: true, message: 'Remove from cart endpoint - coming soon' });
});

export default router;