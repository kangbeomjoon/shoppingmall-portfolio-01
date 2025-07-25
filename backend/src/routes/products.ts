import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  searchProducts, 
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Admin routes (require admin authentication)
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

export default router;