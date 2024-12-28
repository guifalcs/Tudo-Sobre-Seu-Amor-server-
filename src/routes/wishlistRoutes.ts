import { Router } from 'express';
import {
  getWishlistItems,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
} from '../controllers/wishlistController';

const wishlistRouter = Router();

wishlistRouter.get('/', getWishlistItems);
wishlistRouter.post('/', createWishlistItem);
wishlistRouter.put('/:id', updateWishlistItem);
wishlistRouter.delete('/:id', deleteWishlistItem);

export default wishlistRouter;