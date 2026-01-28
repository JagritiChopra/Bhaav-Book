import express from 'express';
import { createInsight, getAllInsights, getInsightById } from '../controllers/insight.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.post('/', isAuthenticated, createInsight);
router.get('/', isAuthenticated, getAllInsights);
router.get('/:id', isAuthenticated, getInsightById);

export default router;