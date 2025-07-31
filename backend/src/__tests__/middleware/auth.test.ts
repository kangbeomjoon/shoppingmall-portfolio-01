import { Request, Response, NextFunction } from 'express';
import { authenticate, optionalAuth, requireAdmin, AuthenticatedRequest } from '@/middleware/auth';
import { verifyToken } from '@/utils/jwt';
import prisma from '@/lib/db';

// Mock dependencies
jest.mock('@/utils/jwt');
jest.mock('@/lib/db', () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

const mockedVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;
const mockedPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Auth Middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('authenticate', () => {
    it('should authenticate user with valid token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        isAdmin: false,
      };

      req.headers!.authorization = 'Bearer valid-token';
      mockedVerifyToken.mockReturnValue({ userId: 'user-123', email: 'test@example.com' });
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await authenticate(req as AuthenticatedRequest, res as Response, next);

      expect(mockedVerifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: { id: true, email: true, name: true, isAdmin: true },
      });
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 when no authorization header', async () => {
      await authenticate(req as AuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access token required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header does not start with Bearer', async () => {
      req.headers!.authorization = 'Basic invalid-format';

      await authenticate(req as AuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access token required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
      req.headers!.authorization = 'Bearer invalid-token';
      mockedVerifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticate(req as AuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when user not found', async () => {
      req.headers!.authorization = 'Bearer valid-token';
      mockedVerifyToken.mockReturnValue({ userId: 'user-123', email: 'test@example.com' });
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await authenticate(req as AuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should authenticate user with valid token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        isAdmin: false,
      };

      req.headers!.authorization = 'Bearer valid-token';
      mockedVerifyToken.mockReturnValue({ userId: 'user-123', email: 'test@example.com' });
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await optionalAuth(req as AuthenticatedRequest, res as Response, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should continue without authentication when no header', async () => {
      await optionalAuth(req as AuthenticatedRequest, res as Response, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    it('should continue without authentication when token is invalid', async () => {
      req.headers!.authorization = 'Bearer invalid-token';
      mockedVerifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await optionalAuth(req as AuthenticatedRequest, res as Response, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    it('should continue without authentication when user not found', async () => {
      req.headers!.authorization = 'Bearer valid-token';
      mockedVerifyToken.mockReturnValue({ userId: 'user-123', email: 'test@example.com' });
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await optionalAuth(req as AuthenticatedRequest, res as Response, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('should authenticate admin user with valid token', async () => {
      const mockAdminUser = {
        id: 'admin-123',
        email: 'admin@example.com',
        name: 'Admin User',
        isAdmin: true,
      };

      req.headers!.authorization = 'Bearer valid-token';
      mockedVerifyToken.mockReturnValue({ userId: 'admin-123', email: 'admin@example.com' });
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdminUser);

      await requireAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(req.user).toEqual(mockAdminUser);
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 when user is not admin', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        name: 'Regular User',
        isAdmin: false,
      };

      req.headers!.authorization = 'Bearer valid-token';
      mockedVerifyToken.mockReturnValue({ userId: 'user-123', email: 'user@example.com' });
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await requireAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when no authorization header', async () => {
      await requireAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Access token required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when user not found', async () => {
      req.headers!.authorization = 'Bearer valid-token';
      mockedVerifyToken.mockReturnValue({ userId: 'user-123', email: 'user@example.com' });
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await requireAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});