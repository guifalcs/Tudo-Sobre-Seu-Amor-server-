import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import asyncHandler from 'express-async-handler';

export const getLovemapItems = asyncHandler(async (req: Request, res: Response) => {
  const lovemapItems = await prisma.lovemap.findMany({
    where: { userId: req.params.id },
  });
  res.status(200).json(lovemapItems);
});

export const createLovemapItem = asyncHandler(async (req: Request, res: Response) => {
  const lovemapItem = await prisma.lovemap.create({
    data: req.body,
  });
  res.status(201).json(lovemapItem);
});

export const updateLovemapItem = asyncHandler(async (req: Request, res: Response) => {
  const lovemapItem = await prisma.lovemap.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(lovemapItem);
});

export const deleteLovemapItem = asyncHandler(async (req: Request, res: Response) => {
  await prisma.lovemap.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});