import { Router } from 'express';
import { getCategories, getCategoryById, getCategoryBySlug } from '../controllers/categories';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.get('/slug/:slug', getCategoryBySlug);

export default router;