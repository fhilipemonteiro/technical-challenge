import { Request, Response, Router } from 'express';
import ValidateUpload from '@Middlewares/ValidateUpload';
import GeminiController from '@Controllers/GeminiController';

const router = Router();

const geminiController = new GeminiController();

router.post('/upload', ValidateUpload, async (req: Request, res: Response) => {
  await geminiController.createMeasure(req, res);
});


router.patch('/confirm', (req, res) => {
});

router.get('/:customer_code/list', (req, res) => {
});

export default router;
