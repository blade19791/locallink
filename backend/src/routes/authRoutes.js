import express from 'express';
import Joi from 'joi';
import { register, login } from '../controllers/authController.js';
import validate from '../middleware/validate.js';

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('client', 'provider', 'admin').default('client'),
  phone: Joi.string().allow('', null),
  location: Joi.string().allow('', null),
  location_text: Joi.string().allow('', null),
  services: Joi.array().items(Joi.string()).optional()
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
