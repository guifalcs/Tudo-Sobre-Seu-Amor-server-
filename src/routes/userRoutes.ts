import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { validateRequest } from '../middlewares/validateRequest';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', validateRequest(createUserSchema), createUser);
router.put('/:id', validateRequest(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;