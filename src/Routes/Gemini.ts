import { Router } from 'express';
import ValidateUpload from '@Middlewares/ValidateUpload';

const router = Router();

router.post('/upload', ValidateUpload,(req, res) => {
  res.send('Upload');
});

router.patch('/confirm', (req, res) => {
});

router.get('/:customer_code/list', (req, res) => {
});

export default router;
