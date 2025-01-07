import { Router } from 'express';
import {
  getLovemapItems,
  createLovemapItem,
  updateLovemapItem,
  deleteLovemapItem,
} from '../controllers/lovemapController';
import { validateRequest } from '../middlewares/validateRequest';
import { lovemapSchema } from '../schemas/lovemapSchema';

const router = Router();

router.get('/:id', getLovemapItems);
router.post('/', validateRequest(lovemapSchema), createLovemapItem);
router.put('/:id', validateRequest(lovemapSchema), updateLovemapItem);
router.delete('/:id', deleteLovemapItem);

export default router;