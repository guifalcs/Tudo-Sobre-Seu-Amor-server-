import { Router } from 'express';
import {
  getRelationship,
  createRelationship,
  updateRelationship,
} from '../controllers/relationshipController';
import { validateRequest } from '../middlewares/validateRequest';
import { relationshipSchema, updateRelationshipSchema } from '../schemas/relationshipSchema';

const relationshipRoutes = Router();

relationshipRoutes.get('/:id', getRelationship);
relationshipRoutes.post('/', validateRequest(relationshipSchema), createRelationship);
relationshipRoutes.put('/', validateRequest(updateRelationshipSchema), updateRelationship);

export default relationshipRoutes;