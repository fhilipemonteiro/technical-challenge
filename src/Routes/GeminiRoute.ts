import { Request, Response, Router } from 'express';
import ValidateDataReceived from '@Middlewares/ValidateDataReceived';
import GeminiController from '@Controllers/GeminiController';
import { UploadSchema, ConfirmSchema, ListMeasuresSchema } from '@Schemas/'
import { ListMeasuresDTO } from './GeminiDTO';

const router = Router();

const geminiController = new GeminiController();

router.post('/upload', ValidateDataReceived(UploadSchema, 'INVALID_DATA'), async (req: Request, res: Response) => {
  await geminiController.createMeasure(req, res);
});


router.patch('/confirm', ValidateDataReceived(ConfirmSchema, 'INVALID_DATA'), async (req: Request, res: Response) => {
  await geminiController.confirmMeasure(req, res);
});

router.get('/:customer_code/list', ValidateDataReceived(ListMeasuresSchema, 'INVALID_TYPE'), async (req: Request & ListMeasuresDTO, res: Response) => {
  await geminiController.listMeasures(req, res);
});

export default router;
