import { Request, Response } from 'express';

import { AuthService } from './auth.service.js';

import {
  loginSchema,
  registerSchema,
} from './auth.validation.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);

      const user = await AuthService.register(validatedData);

      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Registration failed',
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);

      const result = await AuthService.login(
        validatedData.email,
        validatedData.password
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Login failed',
      });
    }
  }
}