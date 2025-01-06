import { Router } from 'express';
import {
  getSpecialDates,
  createSpecialDate,
  updateSpecialDate,
  deleteSpecialDate,
} from '../controllers/specialDateController';
import { validateRequest } from '../middlewares/validateRequest';
import { specialDateSchema } from '../schemas/specialDateSchema';

const router = Router();

router.get('/:id', getSpecialDates);
router.post('/', validateRequest(specialDateSchema), createSpecialDate);
router.put('/:id', validateRequest(specialDateSchema), updateSpecialDate);
router.delete('/:id', deleteSpecialDate);

export default router;