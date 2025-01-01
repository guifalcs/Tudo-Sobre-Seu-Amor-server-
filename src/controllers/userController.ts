import { Request, Response } from "express";
import prisma from "../lib/prisma";
import asyncHandler from "express-async-handler";
import { NotFoundError } from "../lib/errors";
import {
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../schemas/userSchema";
import bcrypt from "bcryptjs";
import { UserCreateData, UserUpdateData } from "../types/user";
import jwt from "jsonwebtoken";

const secret_key = process.env.JWT_SECRET_KEY || "you_secret_key";

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
      subscription: true
    },
  });

  if (!user) {
    throw new NotFoundError("User");
  }

  res.status(200).json({ user });
});

export const getUserLogin = asyncHandler(
  async (req: Request, res: Response) => {

    const validatedData = await loginUserSchema.parseAsync(req.body);

    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
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

    const { password, ...userWithoutPassword } = user;


    const isPasswordValid = await bcrypt.compare(req.body.password, password)

    if(!isPasswordValid){
      res.status(400).json('Senha incorreta');
    } else {
      const id = user.id;

      const token = jwt.sign({ id }, secret_key, {
        expiresIn: "30d",
      });

      res.status(201).json({ user: userWithoutPassword, token });
    }
  }
);

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
    const id = user.id;

    const token = jwt.sign({ id }, secret_key, {
      expiresIn: "30d",
    });

    res.status(201).json({ user: userWithoutPassword, token });
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
