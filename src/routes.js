import express from 'express';
import transactionController from './controller/transactionController.js';

const router = express.Router();

// 路由分发
router.use('/transaction', transactionController);

export default router;