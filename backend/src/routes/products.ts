import { Router } from 'express';
import { getProducts, getProductById, searchProducts, getFeaturedProducts } from '../controllers/products';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

export default router;