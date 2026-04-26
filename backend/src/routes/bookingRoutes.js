import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.patch('/:id/status', updateBookingStatus);

export default router;
