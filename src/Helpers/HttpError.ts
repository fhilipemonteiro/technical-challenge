import { Response } from 'express';

interface IMessageError {
  error_code: string;
  error_description: string | string[];
}

interface IHttpError {
  BadRequest: (res: Response, error: IMessageError) => Response;
  Duplicate: (res: Response, error: IMessageError) => Response;
  InternalServerError: (res: Response, error: IMessageError) => Response;
}

class HttpError implements IHttpError {
  public BadRequest(res: Response, error: IMessageError): Response {
    return res.status(400).json({
      error_code: error.error_code,
      error_description: error.error_description,
    });
  }

  public Duplicate(res: Response, error: IMessageError): Response {
    return res.status(409).json({
      error_code: error.error_code,
      error_description: error.error_description,
    });
  }

  public InternalServerError(res: Response, error: IMessageError): Response {
    return res.status(500).json({
      error_code: error.error_code,
      error_description: error.error_description,
    });
  }
}

export default HttpError;
