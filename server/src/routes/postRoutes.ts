import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ApiResponse } from '../types/index.js';

const router = Router();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: true,
    message: 'Posts endpoint - coming soon'
  };
  res.json(response);
}));

export default router;