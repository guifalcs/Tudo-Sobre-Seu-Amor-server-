import { Router } from 'express';
import {
  getLovemapItems,
  createLovemapItem,
  updateLovemapItem,
  deleteLovemapItem,
} from '../controllers/lovemapController';

const lovemapRoutes = Router();

lovemapRoutes.get('/', getLovemapItems);
lovemapRoutes.post('/', createLovemapItem);
lovemapRoutes.put('/:id', updateLovemapItem);
lovemapRoutes.delete('/:id', deleteLovemapItem);

export default lovemapRoutes;