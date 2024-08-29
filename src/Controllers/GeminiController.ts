import { Request, Response } from "express";
import { v4 as uuid } from 'uuid';
import GeminiRepository from "@Repositories/GeminiRepository";
import GeminiService from "@Services/GeminiService";
import { UploadDTO, UploadResponseDTO } from "@Routes/GeminiDTO";
import HttpError from "@Helpers/HttpError";
import HttpResponse from "@Helpers/HttpResponse";
import logger from "@Helpers/Logger";

interface IGeminiController {
  createMeasure: (req: Request, res: Response) => Promise<Response>;
}

class GeminiController implements IGeminiController {

  private geminiRepository: GeminiRepository;
  private geminiService: GeminiService;
  private httpError: HttpError;
  private httpResponse: HttpResponse;

  constructor() {
    this.geminiRepository = new GeminiRepository();
    this.geminiService = new GeminiService();
    this.httpError = new HttpError();
    this.httpResponse = new HttpResponse();
  }

  async createMeasure(req: Request, res: Response): Promise<Response> {
    const { image, customer_code, measure_datetime, measure_type }: UploadDTO = req.body;

    try {
      const existsMeasure = await this.geminiRepository.checkMeasureExists(customer_code, measure_type, measure_datetime);

      if (existsMeasure) {
        return this.httpError.Duplicate(res, {
          error_code: 'DOUBLE_REPORT',
          error_description: 'Leitura do mês já realizada'
        });
      }

      const uploadImage = await this.geminiService.uploadImage(image);

      const consumeMeasure = await this.geminiService.analysisConsumeMeter(uploadImage.mimeType, uploadImage.uri);

      const response: UploadResponseDTO = {
        image_url: uploadImage.uri,
        measure_value: consumeMeasure,
        measure_uuid: uuid(),
      };

      await this.geminiRepository.createMeasure({
        measure_datetime,
        measure_type,
        customer_code,
        image_url: response.image_url,
        measure_uuid: response.measure_uuid
      });

      return this.httpResponse.Ok(res, response);
    } catch (error) {
      logger.error('Erro interno no servidor');
      logger.error(error);
      return this.httpError.InternalServerError(res, {
        error_code: 'INTERNAL_SERVER_ERROR',
        error_description: 'Erro interno no servidor'
      });
    }
  }
}

export default GeminiController;