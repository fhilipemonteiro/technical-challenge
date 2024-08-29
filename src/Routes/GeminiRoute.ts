import { Request, Response, Router } from 'express';
import ValidateDataReceived from '@Middlewares/ValidateDataReceived';
import GeminiController from '@Controllers/GeminiController';
import { UploadSchema, ConfirmSchema } from '@Schemas/'

const router = Router();

const geminiController = new GeminiController();

router.post('/upload', ValidateDataReceived(UploadSchema), async (req: Request, res: Response) => {
  await geminiController.createMeasure(req, res);
});


router.patch('/confirm', ValidateDataReceived(ConfirmSchema), async (req, res) => {
  await geminiController.confirmMeasure(req, res);
});

router.get('/:customer_code/list', (req, res) => {
});

export default router;
