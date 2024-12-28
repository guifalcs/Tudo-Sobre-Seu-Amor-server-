import { Router } from 'express';
import {
  getSpecialDates,
  createSpecialDate,
  updateSpecialDate,
  deleteSpecialDate,
} from '../controllers/specialDateController';

const specialDateRouter = Router();

specialDateRouter.get('/', getSpecialDates);
specialDateRouter.post('/', createSpecialDate);
specialDateRouter.put('/:id', updateSpecialDate);
specialDateRouter.delete('/:id', deleteSpecialDate);

export default specialDateRouter;