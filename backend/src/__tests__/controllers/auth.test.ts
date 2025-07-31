import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { register, login, getMe, logout } from '@/controllers/auth';
import { generateToken } from '@/utils/jwt';
import prisma from '@/lib/db';
import { AuthenticatedRequest } from '@/middleware/auth';

// Mock dependencies
jest.mock('bcrypt');
jest.mock('@/utils/jwt');
jest.mock('@/lib/db', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedGenerateToken = generateToken as jest.MockedFunction<typeof generateToken>;
const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('register', () => {
    const validRegisterData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      phone: '123-456-7890',
    };

    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: validRegisterData.email,
        name: validRegisterData.name,
        phone: validRegisterData.phone,
      };
      const mockToken = 'mock-jwt-token';

      req.body = validRegisterData;
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (mockedPrisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      mockedGenerateToken.mockReturnValue(mockToken);

      await register(req as Request, res as Response);

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validRegisterData.email },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(validRegisterData.password, 10);
      expect(mockedPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: validRegisterData.email,
          password: 'hashed-password',
          name: validRegisterData.name,
          phone: validRegisterData.phone,
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          token: mockToken,
          user: mockUser,
        },
        message: 'User registered successfully',
      });
    });

    it('should return 400 for invalid email', async () => {
      req.body = { ...validRegisterData, email: 'invalid-email' };

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email format',
      });
    });

    it('should return 400 for short password', async () => {
      req.body = { ...validRegisterData, password: '123' };

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    });

    it('should return 409 for existing email', async () => {
      req.body = validRegisterData;
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing-user' });

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email already registered',
      });
    });

    it('should handle database errors', async () => {
      req.body = validRegisterData;
      (mockedPrisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
      });
    });
  });

  describe('login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user-123',
      email: validLoginData.email,
      name: 'Test User',
      password: 'hashed-password',
      phone: '123-456-7890',
    };

    it('should login user successfully', async () => {
      const mockToken = 'mock-jwt-token';

      req.body = validLoginData;
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockedGenerateToken.mockReturnValue(mockToken);

      await login(req as Request, res as Response);

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: validLoginData.email },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(validLoginData.password, mockUser.password);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          token: mockToken,
          user: {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
            phone: mockUser.phone,
          },
        },
        message: 'Login successful',
      });
    });

    it('should return 400 for invalid email format', async () => {
      req.body = { ...validLoginData, email: 'invalid-email' };

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email format',
      });
    });

    it('should return 401 for non-existent user', async () => {
      req.body = validLoginData;
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email or password',
      });
    });

    it('should return 401 for invalid password', async () => {
      req.body = validLoginData;
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockedBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email or password',
      });
    });
  });

  describe('getMe', () => {
    let authReq: Partial<AuthenticatedRequest>;

    beforeEach(() => {
      authReq = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
        },
      };
    });

    it('should return user profile successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        phone: '123-456-7890',
        createdAt: new Date(),
      };

      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await getMe(authReq as AuthenticatedRequest, res as Response);

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          createdAt: true,
        },
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
    });

    it('should return 401 when user not authenticated', async () => {
      delete authReq.user;

      await getMe(authReq as AuthenticatedRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not authenticated',
      });
    });

    it('should return 404 when user not found in database', async () => {
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await getMe(authReq as AuthenticatedRequest, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found',
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      await logout({} as AuthenticatedRequest, res as Response);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
});