import express from 'express';
import Joi from 'joi';
import {
  updateProfile,
  updateServices,
  toggleAvailability,
  getProviderDetails,
  getProviderReviews
} from '../controllers/providerController.js';
import { verifyToken, isProvider } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

const profileSchema = Joi.object({
  phone: Joi.string().allow('', null),
  location_text: Joi.string().allow('', null),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  description: Joi.string().allow('', null),
  is_available: Joi.boolean()
});

const servicesSchema = Joi.object({
  service_ids: Joi.array().items(Joi.string().uuid()).required()
});

const availabilitySchema = Joi.object({
  is_available: Joi.boolean().required()
});

// Public routes
router.get('/:id', getProviderDetails);
router.get('/:id/reviews', getProviderReviews);

// Protected routes (Providers only)
router.use(verifyToken, isProvider);

router.post('/profile', validate(profileSchema), updateProfile);
router.post('/services', validate(servicesSchema), updateServices);
router.patch('/availability', validate(availabilitySchema), toggleAvailability);

export default router;
