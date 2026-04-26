import express from 'express';
import Joi from 'joi';
import { createReview } from '../controllers/reviewController.js';
import { verifyToken } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

const reviewSchema = Joi.object({
  provider_id: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('', null)
});

// Any logged in user can leave a review
router.post('/', verifyToken, validate(reviewSchema), createReview);

export default router;
