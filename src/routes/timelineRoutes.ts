import { Router } from 'express';
import {
  getTimelines,
  createTimeline,
  updateTimeline,
  deleteTimeline,
} from '../controllers/timelineController';
import { validateRequest } from '../middlewares/validateRequest';
import { timelineSchema } from '../schemas/timelineSchema';

const router = Router();

router.get('/', getTimelines);
router.post('/', validateRequest(timelineSchema), createTimeline);
router.put('/:id', validateRequest(timelineSchema), updateTimeline);
router.delete('/:id', deleteTimeline);

export default router;