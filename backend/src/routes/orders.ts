import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// 일시적으로 기본 응답 제공 (추후 구현 예정)
router.get('/', authenticate, (req, res) => {
  res.json({ success: true, data: [], message: 'Orders endpoint - coming soon' });
});

router.post('/', authenticate, (req, res) => {
  res.json({ success: true, message: 'Create order endpoint - coming soon' });
});

router.get('/:id', authenticate, (req, res) => {
  res.json({ success: true, message: 'Get order endpoint - coming soon' });
});

export default router;