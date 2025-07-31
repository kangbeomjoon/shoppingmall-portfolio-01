import jwt from 'jsonwebtoken';
import { generateToken, verifyToken, decodeToken, JwtPayload } from '@/utils/jwt';
import { User } from '@prisma/client';

// Mock jwt
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('JWT Utils', () => {
  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    phone: null,
    isAdmin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPayload: JwtPayload = {
    userId: mockUser.id,
    email: mockUser.email,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '7d';
  });

  describe('generateToken', () => {
    it('should generate a token with correct payload', () => {
      const mockToken = 'mock-jwt-token';
      mockedJwt.sign.mockReturnValue(mockToken as any);

      const result = generateToken(mockUser);

      expect(mockedJwt.sign).toHaveBeenCalledWith(
        mockPayload,
        'test-jwt-secret',
        { expiresIn: '7d' }
      );
      expect(result).toBe(mockToken);
    });

    it('should use default JWT_SECRET if not provided', () => {
      delete process.env.JWT_SECRET;
      const mockToken = 'mock-jwt-token';
      mockedJwt.sign.mockReturnValue(mockToken as any);

      generateToken(mockUser);

      expect(mockedJwt.sign).toHaveBeenCalledWith(
        mockPayload,
        'test-jwt-secret',
        { expiresIn: '7d' }
      );
    });

    it('should use default expiration if not provided', () => {
      delete process.env.JWT_EXPIRES_IN;
      const mockToken = 'mock-jwt-token';
      mockedJwt.sign.mockReturnValue(mockToken as any);

      generateToken(mockUser);

      expect(mockedJwt.sign).toHaveBeenCalledWith(
        mockPayload,
        'test-jwt-secret',
        { expiresIn: '7d' }
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify and return payload for valid token', () => {
      const mockToken = 'valid-token';
      mockedJwt.verify.mockReturnValue(mockPayload as any);

      const result = verifyToken(mockToken);

      expect(mockedJwt.verify).toHaveBeenCalledWith(mockToken, 'test-jwt-secret');
      expect(result).toEqual(mockPayload);
    });

    it('should throw error for invalid token', () => {
      const mockToken = 'invalid-token';
      const mockError = new Error('Invalid token');
      mockedJwt.verify.mockImplementation(() => {
        throw mockError;
      });

      expect(() => verifyToken(mockToken)).toThrow(mockError);
    });
  });

  describe('decodeToken', () => {
    it('should decode and return payload for valid token', () => {
      const mockToken = 'valid-token';
      mockedJwt.decode.mockReturnValue(mockPayload as any);

      const result = decodeToken(mockToken);

      expect(mockedJwt.decode).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual(mockPayload);
    });

    it('should return null for invalid token', () => {
      const mockToken = 'invalid-token';
      mockedJwt.decode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = decodeToken(mockToken);

      expect(result).toBeNull();
    });

    it('should return null when decode returns null', () => {
      const mockToken = 'token';
      mockedJwt.decode.mockReturnValue(null);

      const result = decodeToken(mockToken);

      expect(result).toBeNull();
    });
  });
});