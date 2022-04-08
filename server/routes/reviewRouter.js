import Router from 'express';
const router = new Router();
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js';
import ReviewController from '../controllers/ReviewController.js';

router.post('/review', authMiddleware, ReviewController.createReview);
router.delete('/review', authMiddleware, ReviewController.deleteReview);

router.post('/answer', authMiddleware, ReviewController.createAnswer);
router.delete('/answer', authMiddleware, ReviewController.deleteAnswer);

router.get('/product', ReviewController.getReviewsByProductId);
router.get('/user', authMiddleware, ReviewController.getReviewsByUserId);
router.get('/', authMiddleware, checkRoleMiddleware, ReviewController.getAllReviews);

export default router;