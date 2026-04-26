import express from 'express';
import {
  getPendingProviders,
  approveProvider,
  rejectProvider,
  getAllProviders,
  addService,
  updateService,
  deleteService
} from '../controllers/adminController.js';

import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes must be protected
router.use(verifyToken, isAdmin);

router.get('/providers/pending', getPendingProviders);
router.get('/providers', getAllProviders);
router.patch('/providers/:id/approve', approveProvider);
router.patch('/providers/:id/reject', rejectProvider);

// Service management
router.post('/services', addService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);


export default router;
