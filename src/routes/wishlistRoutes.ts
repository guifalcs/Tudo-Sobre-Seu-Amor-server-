import { Router } from 'express';
import {
  getWishlistItems,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
} from '../controllers/wishlistController';
import { validateRequest } from '../middlewares/validateRequest';
import { wishlistSchema } from '../schemas/wishlistSchema';

const router = Router();

router.get('/:id', getWishlistItems);
router.post('/', validateRequest(wishlistSchema), createWishlistItem);
router.put('/:id', validateRequest(wishlistSchema), updateWishlistItem);
router.delete('/:id', deleteWishlistItem);

export default router;