import { Request, Response, NextFunction } from 'express';
import {
  getUsers,
  getUserById,
  getUserLogin,
  createUser,
  updateUser,
  deleteUser,
} from '../../controllers/userController';
import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUserSchema, loginUserSchema, updateUserSchema } from '../../schemas/userSchema';

jest.mock('../../schemas/userSchema', () => ({
  createUserSchema: {
    parseAsync: jest.fn().mockImplementation((data) => Promise.resolve(data)),
  },
  loginUserSchema: {
    parseAsync: jest.fn().mockImplementation((data) => Promise.resolve(data)),
  },
  updateUserSchema: {
    parseAsync: jest.fn().mockImplementation((data) => Promise.resolve(data)),
  },
}));

jest.mock('../../lib/prisma', () => ({
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  subscription: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('getUsers', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should return all users', async () => {
    const mockUsers = [
      { id: '1', name: 'User 1' },
      { id: '2', name: 'User 2' },
    ];

    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    await getUsers(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const error = new Error('Database error');
    (prisma.user.findMany as jest.Mock).mockRejectedValue(error);

    await getUsers(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('getUserById', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockReq = {
      params: { id: '1' },
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should return user by id', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      specialDates: [],
      timeline: [],
      wishlist: [],
      lovemap: [],
      subscription: null,
      relationship: null,
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    await getUserById(mockReq as Request, mockRes as Response, mockNext);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: {
        specialDates: true,
        timeline: true,
        wishlist: true,
        lovemap: true,
        subscription: true,
        relationship: true,
      },
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ user: mockUser });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when user does not exist', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await getUserById(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('getUserLogin', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockReq = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should login user successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
      specialDates: [],
      timeline: [],
      wishlist: [],
      lovemap: [],
      subscription: null,
      relationship: null,
    };

    (loginUserSchema.parseAsync as jest.Mock).mockResolvedValue(mockReq.body);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mockToken');

    await getUserLogin(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      user: expect.not.objectContaining({ password: expect.any(String) }),
      token: 'mockToken',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return error for incorrect password', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    (loginUserSchema.parseAsync as jest.Mock).mockResolvedValue(mockReq.body);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await getUserLogin(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith('Senha incorreta');
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle user not found', async () => {
    (loginUserSchema.parseAsync as jest.Mock).mockResolvedValue(mockReq.body);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await getUserLogin(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('createUser', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockReq = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        status: 'Ativo',
        subscription: 'Nenhum',
      },
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should create user successfully', async () => {
    const mockSubscription = { id: 'sub1', title: 'Nenhum' };
    const mockUser = {
      name: 'test user',
      email: 'test@example.com',
      password: 'hashedPassword',
      status: 'Ativo',
      subscription: mockSubscription,
    };

    (createUserSchema.parseAsync as jest.Mock).mockResolvedValue(mockReq.body);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue(mockSubscription);
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
    (jwt.sign as jest.Mock).mockReturnValue('mockToken');

    await createUser(mockReq as Request, mockRes as Response, mockNext);

    expect(prisma.subscription.findUnique).toHaveBeenCalledWith({
      where: { title: 'Nenhum' },
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'test user',
        email: 'test@example.com',
        password: 'hashedPassword',
        status: 'Ativo',
        subscription: {
          connect: { id: 'sub1' },
        },
      },
    });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      user: expect.not.objectContaining({ password: expect.any(String) }),
      token: 'mockToken',
    });
  });

  it('should return error for non-existent subscription', async () => {
    (createUserSchema.parseAsync as jest.Mock).mockResolvedValue(mockReq.body);
    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue(null);

    await createUser(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith('Plano inexistente');
  });

  it('should handle validation errors', async () => {
    const validationError = new Error('Validation failed');
    (createUserSchema.parseAsync as jest.Mock).mockRejectedValue(validationError);

    await createUser(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(validationError);
  });
});

describe('updateUser', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockReq = {
      params: { id: '1' },
      body: {
        name: 'Updated User',
        email: 'updated@example.com',
        status: 'Inativo',
        subscription: 'Romântico',
      },
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should update user successfully', async () => {
    const mockSubscription = { id: 'sub2', title: 'Romântico' };
    const mockUpdatedUser = {
      id: '1',
      name: 'Updated User',
      email: 'updated@example.com',
      status: 'Inativo',
      subscription: mockSubscription,
      password: 'hashedPassword',
    };

    (updateUserSchema.parseAsync as jest.Mock).mockResolvedValue(mockReq.body);
    (prisma.subscription.findFirst as jest.Mock).mockResolvedValue(mockSubscription);
    (prisma.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

    await updateUser(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.json).toHaveBeenCalledWith(
      expect.not.objectContaining({ password: expect.any(String) })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle validation errors', async () => {
    const validationError = new Error('Validation failed');
    (updateUserSchema.parseAsync as jest.Mock).mockRejectedValue(validationError);

    await updateUser(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(validationError);
  });
});

describe('deleteUser', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockReq = {
      params: { id: '1' },
    };
    mockRes = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should delete user successfully', async () => {
    (prisma.user.delete as jest.Mock).mockResolvedValue({});

    await deleteUser(mockReq as Request, mockRes as Response, mockNext);

    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith('Usuário deletado');
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle deletion errors', async () => {
    const error = new Error('Deletion failed');
    (prisma.user.delete as jest.Mock).mockRejectedValue(error);

    await deleteUser(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});