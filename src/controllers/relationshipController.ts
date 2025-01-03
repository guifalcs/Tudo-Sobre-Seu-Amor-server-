import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import asyncHandler from 'express-async-handler';
import { NotFoundError } from '../lib/errors';
import { validateAndParseDate } from '../utils/dateValidation';

export const getRelationship = asyncHandler(async (req: Request, res: Response) => {

  const userId = req.params.userId;
  
  const relationship = await prisma.relationship.findFirst({
    where: { userId },
  });

  if (!relationship) {
    throw new NotFoundError('Relacionamento não encontrado');
  }

  res.json(relationship);
});

export const createRelationship = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { partnerName, startDate } = req.body;

  const validatedDate = validateAndParseDate(startDate);
  if (!validatedDate) {
    throw new Error('Data em formato inválido');
  }

  const relationship = await prisma.relationship.create({
    data: {
      userId,
      partnerName,
      startDate: validatedDate,
    },
  });

  res.status(201).json(relationship);
});

export const updateRelationship = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { partnerName, startDate } = req.body;

  let updateData: any = {};
  
  if (partnerName) {
    updateData.partnerName = partnerName;
  }

  if (startDate) {
    const validatedDate = validateAndParseDate(startDate);
    if (!validatedDate) {
      throw new Error('Invalid date format');
    }
    updateData.startDate = validatedDate;
  }

  const relationship = await prisma.relationship.update({
    where: { userId },
    data: updateData,
  });

  res.json(relationship);
});