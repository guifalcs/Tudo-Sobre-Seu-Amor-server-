import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../lib/errors';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'ValidationError',
      message: err.errors.map(e => e.message),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        error: 'ConflictError',
        message: 'Esse email já está cadastrado em outra conta',
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        error: 'NotFoundError',
        message: 'Registro não encontrado',
      });
      return;
    }
  }

  console.error(err);
  res.status(500).json({
    error: 'InternalServerError',
    message: 'Um erro inesperado ocorreu',
  });
};