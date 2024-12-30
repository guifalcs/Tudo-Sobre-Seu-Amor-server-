import { Request, Response } from "express";
import prisma from "../lib/prisma";
import asyncHandler from "express-async-handler";
import { NotFoundError } from "../lib/errors";
import { createUserSchema, updateUserSchema } from "../schemas/userSchema";
import bcrypt from "bcryptjs";
import { UserCreateData, UserUpdateData } from "../types/user";

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
    throw new NotFoundError("User");
  }

  res.json(user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = await createUserSchema.parseAsync(req.body);

  const hashedPassword = await bcrypt.hash(validatedData.password, 10);
  const subscription = await prisma.subscription.findUnique({
    where: { title: validatedData.subscription },
  });

  if (subscription == null || subscription == undefined) {
    res.status(400).json("Plano inexistente");
  } else {
    const subscriptionId = subscription!.id;

    const userData: UserCreateData = {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      status: validatedData.status,
      subscription: {
        connect: { id: subscriptionId },
      },
    };

    const user = await prisma.user.create({
      data: userData,
    });

    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  }
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = await updateUserSchema.parseAsync(req.body);

  const hashedPassword = validatedData.password
    ? await bcrypt.hash(validatedData.password, 10)
    : undefined;

  const subscription = await prisma.subscription.findFirst({
    where: { title: validatedData.subscription },
  });
  if (subscription!.id! && validatedData.subscription) {
    res.status(400).json("Plano inexistente");
  } else {
    const subscriptionId = subscription!.id;

    const userData: UserUpdateData = {
      ...(validatedData.name && { name: validatedData.name }),
      ...(validatedData.email && { email: validatedData.email }),
      ...(hashedPassword && { password: hashedPassword }),
      ...(validatedData.status && { status: validatedData.status }),
      ...(validatedData.subscription && { connect: { id: subscriptionId } }),
    };

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: userData,
    });

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await prisma.user.delete({
    where: { id: req.params.id },
  });
  res.status(200).send("Usuário deletado");
});
