import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import HttpError from '@Helpers/HttpError';

const httpError = new HttpError();

const validateDataReceived = (schema: ZodSchema, error_code: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((err) => err.message);
        return httpError.BadRequest(res, {
          error_code,
          error_description: errorMessage,
        });
      }
      next(error);
    }
  }
};

export default validateDataReceived;
