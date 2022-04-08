import { Review, Answer} from "../db/models.js";
import ApiError from "../error/ApiError.js";
import ReviewService from "../services/ReviewService.js";


class ReviewController {
    async createReview(req, res, next) {
        try {
            const { rating, comment, productId, userId } = req.body;
            if (!rating || !comment || !productId || !userId) return next(ApiError.badRequest('All fields must be filled'));
            await ReviewService.createReview(rating, comment, productId, userId);
            res.status(201).json('Review created');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteReview(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) return next(ApiError.badRequest('Review ID not specified'));
            await ReviewService.deleteReview(id);
            res.status(200).json('Review removed');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createAnswer(req, res, next) {
        try {
            const { comment, reviewId, userId } = req.body;
            if (!comment || !reviewId || !userId) return next(ApiError.badRequest('All fields must be filled'));
            await ReviewService.createAnswer(comment, reviewId, userId);
            res.status(201).json('Answer created');

        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteAnswer(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) return next(ApiError.badRequest('Answer id not specified'));
            await ReviewService.deleteAnswer(id);
            res.status(200).json('Answer deleted');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getReviewsByProductId(req, res, next) {
        try {
            const { productId } = req.query;
            if (!productId) return next(ApiError.badRequest('Product ID not specified'));
            res.status(200).json(await ReviewService.getReviewsByProductId(productId));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getReviewsByUserId(req, res, next) {
        try {
            const { userId, fetchOption = 'reviews' } = req.query;
            if (!userId) return next(ApiError.badRequest('User id not specified'));

            if (fetchOption === 'reviews') res.status(200).json(await ReviewService.getReviewsByUserId(userId));
            else if (fetchOption === 'answers') res.status(200).json(await ReviewService.getAnswersByUserId(userId));
            else res.status(200).json([]);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getAllReviews(req, res, next) {
        try {
            let { order = 'id' } = req.query;

            if (order == 'id') order = [['id'], [Review, 'createdAt', 'DESC'], [Review, Answer, 'createdAt', 'DESC']];
            else if (order == 'new') order = [[Review, 'createdAt', 'DESC'], [Review, Answer, 'createdAt', 'DESC']];
            else res.status(200).json([]);

            res.status(200).json(await ReviewService.getAllReviews(order));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}


export default new ReviewController();

