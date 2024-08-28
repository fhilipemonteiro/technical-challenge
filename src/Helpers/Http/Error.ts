import { Response } from 'express';

interface IMessageError {
  error_code: string;
  error_description: string | string[];
}

class HttpError {
  public static BadRequest(res: Response, error: IMessageError): Response {
    return res.status(400).json({
      error_code: error.error_code,
      error_description: error.error_description,
    });
  }

  public static Duplicate(res: Response, error: IMessageError): Response {
    return res.status(400).json({
      error_code: error.error_code,
      error_description: error.error_description,
    });
  }
}

export default HttpError;
