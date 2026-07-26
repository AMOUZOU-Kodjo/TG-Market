import { Router } from 'express';
import * as faqController from './faq.controller.js';

const router = Router();

router.get('/', faqController.getAllFaqs);

export default router;
