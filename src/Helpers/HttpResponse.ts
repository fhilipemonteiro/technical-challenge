import { Response } from "express";

interface IHttpReponse {
  Ok(res: Response, data: any): Response;
}

class HttpResponse implements IHttpReponse {
  public Ok(res: Response, data: any) {
    return res.status(200).json(data);
  }
}

export default HttpResponse;