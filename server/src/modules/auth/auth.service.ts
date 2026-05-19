import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import prisma from '../../lib/prisma.js';

interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class AuthService {
  static async register(payload: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: hashedPassword,
      },
    });

    return user;
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },

      process.env.JWT_SECRET as string,

      {
        expiresIn: '1d',
      }
    );

    return {
      user,
      accessToken,
    };
  }
}