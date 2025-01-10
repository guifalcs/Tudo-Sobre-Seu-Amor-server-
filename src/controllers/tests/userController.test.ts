import { describe } from "@jest/globals";
import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { getUsers } from "../userController";

jest.mock("../../lib/prisma", () => ({
  user: {
    findMany: jest.fn()
  },
}));

describe("getUsers", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    (req = {}),
      (res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }),
      (next = jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Deve retornar os usuários, pelo menos o admin", async () => {
    const mockedUsers = [
      {
        id: "e2dbd83e-9ba0-4b4b-a6ad-f6845b2ed5df",
        name: "Teste",
        email: "teste@teste.com",
        password: "123456",
        subscriptionId: "blablabla",
        status: "Ativo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.user.findMany as jest.Mock).mockResolvedValue(mockedUsers);

    await getUsers(req as Request, res as Response, next);

    expect(prisma.user.findMany).toHaveBeenCalled();

    expect(res.json).toHaveBeenCalledWith(mockedUsers);
  });
});
