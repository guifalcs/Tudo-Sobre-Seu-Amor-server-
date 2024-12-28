import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import asyncHandler from 'express-async-handler';

export const getSpecialDates = asyncHandler(async (req: Request, res: Response) => {
  const specialDates = await prisma.specialDate.findMany({
    where: { userId: req.query.userId as string },
  });
  res.json(specialDates);
});

export const createSpecialDate = asyncHandler(async (req: Request, res: Response) => {
  const specialDate = await prisma.specialDate.create({
    data: req.body,
  });
  res.status(201).json(specialDate);
});

export const updateSpecialDate = asyncHandler(async (req: Request, res: Response) => {
  const specialDate = await prisma.specialDate.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(specialDate);
});

export const deleteSpecialDate = asyncHandler(async (req: Request, res: Response) => {
  await prisma.specialDate.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});