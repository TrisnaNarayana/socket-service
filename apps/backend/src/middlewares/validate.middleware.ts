import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.') || 'body';
          if (!formattedErrors[path]) formattedErrors[path] = [];
          formattedErrors[path].push(err.message);
        });

        return res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: formattedErrors,
        });
      }
      next(error);
    }
  };
};
