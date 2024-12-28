import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import asyncHandler from 'express-async-handler';

export const getTimelines = asyncHandler(async (req: Request, res: Response) => {
  const timelines = await prisma.timeline.findMany({
    where: { userId: req.query.userId as string },
  });
  res.json(timelines);
});

export const createTimeline = asyncHandler(async (req: Request, res: Response) => {
  const timeline = await prisma.timeline.create({
    data: req.body,
  });
  res.status(201).json(timeline);
});

export const updateTimeline = asyncHandler(async (req: Request, res: Response) => {
  const timeline = await prisma.timeline.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(timeline);
});

export const deleteTimeline = asyncHandler(async (req: Request, res: Response) => {
  await prisma.timeline.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});