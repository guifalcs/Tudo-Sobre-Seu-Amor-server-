import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserLogin,
} from '../controllers/userController';
import { validateRequest } from '../middlewares/validateRequest';
import { createUserSchema, findUserSchema, loginUserSchema, updateUserSchema } from '../schemas/userSchema';

const router = Router();

router.get('/', getUsers);
router.get('/:id', validateRequest(findUserSchema),getUserById);
router.post('/signup', validateRequest(createUserSchema), createUser);
router.post('/login', validateRequest(loginUserSchema), getUserLogin);
router.put('/:id', validateRequest(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;