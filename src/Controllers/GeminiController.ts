import { Request, Response } from "express";
import { v4 as uuid } from 'uuid';
import GeminiRepository from "@Repositories/GeminiRepository";
import GeminiService from "@Services/GeminiService";
import { ConfirmDTO, ConfirmResponseDTO, ListMeasuresDTO, ListMeasuresResponseDTO, UploadDTO, UploadResponseDTO } from "@Routes/GeminiDTO";
import HttpError from "@Helpers/HttpError";
import HttpResponse from "@Helpers/HttpResponse";
import logger from "@Helpers/Logger";

interface IGeminiController {
  createMeasure: (req: Request, res: Response) => Promise<Response>;
  confirmMeasure: (req: Request, res: Response) => Promise<Response>;
  listMeasures: (req: Request & ListMeasuresDTO, res: Response) => Promise<Response>;
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
      const existsMeasure = await this.geminiRepository.checkExistsMeasureOfThePeriod(customer_code, measure_type, measure_datetime);

      if (existsMeasure) {
        return this.httpError.Conflict(res, {
          error_code: 'DOUBLE_REPORT',
          error_description: 'Leitura do mês já realizada'
        });
      }

      const uploadImage = await this.geminiService.uploadImage(image);

      const consumption = await this.geminiService.analysisConsumeMeter(uploadImage.mimeType, uploadImage.uri);

      const response: UploadResponseDTO = {
        image_url: uploadImage.uri,
        measure_value: consumption,
        measure_uuid: uuid(),
      };

      await this.geminiRepository.createMeasure({
        measure_datetime,
        measure_type,
        customer_code,
        image_url: response.image_url,
        measure_value: response.measure_value,
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

  async confirmMeasure(req: Request, res: Response): Promise<Response> {
    const { measure_uuid, confirmed_value }: ConfirmDTO = req.body;

    try {
      const existsMeasure = await this.geminiRepository.checkExistsMeasure(measure_uuid);
      
      if (!existsMeasure) {
        return this.httpError.NotFound(res, {
          error_code: 'MEASURE_NOT_FOUND',
          error_description: 'Leitura do mês já realizada'
        });
      }

      const isConfirmed = await this.geminiRepository.checkMeasurementIsAlreadyConfirmed(measure_uuid);

      if (isConfirmed) {
        return this.httpError.Conflict(res, {
          error_code: 'CONFIRMATION_DUPLICATE',
          error_description: 'Leitura do mês já realizada'
        });
      }

      const confirmMeasure = await this.geminiRepository.confirmMeasure(measure_uuid, confirmed_value);

      const response: ConfirmResponseDTO = {
        success: confirmMeasure
      };

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

  async listMeasures(req: Request & ListMeasuresDTO, res: Response): Promise<Response> {

    const { customer_code } = req.params;
    const { measure_type } = req.query;

    try {
      const measures = await this.geminiRepository.getMeasures(customer_code, measure_type);

      if (!measures.length) {
        return this.httpError.NotFound(res, {
          error_code: 'MEASURES_NOT_FOUND',
          error_description: 'Nenhuma leitura encontrada'
        });
      }

      const response: ListMeasuresResponseDTO = {
        customer_code,
        measures: measures
      };

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