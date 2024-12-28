import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import asyncHandler from 'express-async-handler';

export const getWishlistItems = asyncHandler(async (req: Request, res: Response) => {
  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId: req.query.userId as string },
  });
  res.json(wishlistItems);
});

export const createWishlistItem = asyncHandler(async (req: Request, res: Response) => {
  const wishlistItem = await prisma.wishlist.create({
    data: req.body,
  });
  res.status(201).json(wishlistItem);
});

export const updateWishlistItem = asyncHandler(async (req: Request, res: Response) => {
  const wishlistItem = await prisma.wishlist.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(wishlistItem);
});

export const deleteWishlistItem = asyncHandler(async (req: Request, res: Response) => {
  await prisma.wishlist.delete({
    where: { id: req.params.id },
  });
  res.status(204).send();
});