import { Router } from 'express';
import {
  getTimelines,
  createTimeline,
  updateTimeline,
  deleteTimeline,
} from '../controllers/timelineController';

const timelineRoutes = Router();

timelineRoutes.get('/', getTimelines);
timelineRoutes.post('/', createTimeline);
timelineRoutes.put('/:id', updateTimeline);
timelineRoutes.delete('/:id', deleteTimeline);

export default timelineRoutes;