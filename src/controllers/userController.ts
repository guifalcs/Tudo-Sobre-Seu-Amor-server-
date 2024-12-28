import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import asyncHandler from 'express-async-handler';
import { NotFoundError } from '../lib/errors';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: {
      specialDates: true,
      timeline: true,
      wishlist: true,
      lovemap: true,
    },
  });
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  res.json(user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await createUserSchema.parseAsync(req.body);
  const user = await prisma.user.create({ data });
  res.status(201).json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const data = await updateUserSchema.parseAsync(req.body);
  
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data,
  });
  
  res.json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await prisma.user.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});