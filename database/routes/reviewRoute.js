import express from 'express';
import { addReview, getProductReviews, deleteReview, toggleHelpful } from '../controllers/reviewController.js';
import authUser from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/add', authUser, addReview);
reviewRouter.post('/list', getProductReviews);          // public
reviewRouter.post('/delete', authUser, deleteReview);
reviewRouter.post('/helpful', authUser, toggleHelpful);

export default reviewRouter;
