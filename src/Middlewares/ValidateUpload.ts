import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import UploadSchema from '@Schemas/UploadSchema';
import HttpError from '@Helpers/Http/Error';

const validateUpload = (req: Request, res: Response, next: NextFunction) => {
  try {
    UploadSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((err) => err.message);
      return HttpError.BadRequest(res, {
        error_code: 'INVALID_DATA',
        error_description: errorMessage,
      });
    }
    next(error);
  }
};

export default validateUpload;
