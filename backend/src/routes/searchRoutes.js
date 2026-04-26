import express from 'express';
import { searchProviders } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', searchProviders);

export default router;
