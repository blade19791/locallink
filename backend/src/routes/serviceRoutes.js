import express from 'express';
import { getServiceSuggestions, getAllServices } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/', getAllServices);
router.get('/suggestions', getServiceSuggestions);


export default router;
