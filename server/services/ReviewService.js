import { Op, Sequelize } from "sequelize";
import { Answer, Category, Product, Review, User } from "../db/models.js";

class ReviewService {
    async createReview(rating, comment, productId, userId) {
        await Review.destroy({ where: { productId, userId } });
        await Review.create({ rating, comment, productId, userId });
    }

    async deleteReview(id) {
        await Review.destroy({ where: { id } });
    }

    async createAnswer(comment, reviewId, userId) {
        await Answer.create({ comment, reviewId, userId });
    }

    async deleteAnswer(id) {
        await Answer.destroy({ where: { id } });
    }

    async getReviewsByProductId(productId) {
        return await Review.findAll({
            where: { productId },
            include: [
                { model: User, attributes: ['name', 'surname'] },
                { model: Answer, include: { model: User, attributes: ['name', 'surname'] } }
            ]
        });
    }

    async getReviewsByUserId(userId) {
        return await Product.findAll({
            attributes: ['id', 'name'],
            order: [[Review, 'createdAt', 'DESC'], [Review, Answer, 'createdAt', 'DESC']],
            include: {
                model: Review,
                where: { userId },
                include: [
                    { model: User, attributes: ['id', 'name', 'surname', 'role'] },
                    { model: Answer, include: { model: User, attributes: ['id', 'name', 'surname', 'role'], order: ['createdAt'] } }
                ]
            }
        });
    }

    async getAnswersByUserId(userId) {
        const reviewsList = [];

        await Answer.findAll({ where: { userId } })
            .then(data => { data.map(answer => reviewsList.push(answer.reviewId)) });

        return await Product.findAll({
            attributes: ['id', 'name'],
            order: [[Review, 'createdAt', 'DESC'], [Review, Answer, 'createdAt', 'DESC']],
            include: {
                model: Review,
                where: { id: reviewsList },
                include: [
                    { model: User, attributes: ['id', 'name', 'surname', 'role'] },
                    { model: Answer, include: { model: User, attributes: ['id', 'name', 'surname', 'role'], order: ['createdAt'] } }
                ]
            }
        });
    }

    async getAllReviews(order) {
        return await Product.findAll({
            order,
            attributes: ['id', 'name', 'description', 'price', 'views', 'isAvailable', 'createdAt',
                [Sequelize.literal('(SELECT COUNT(*) FROM reviews WHERE "productId" = products.id)'), 'countRating'],
                [Sequelize.literal('(SELECT AVG(rating) FROM reviews WHERE "productId" = products.id)'), 'avgRating'],
            ],
            include: [
                {
                    model: Review,
                    where: { id: { [Op.ne]: null } },
                    include: [
                        { model: User, attributes: ['name', 'surname', 'role'] },
                        { model: Answer, include: { model: User, attributes: ['name', 'surname', 'role'] } }
                    ]
                },
                { model: Category, attributes: ['name'] }
            ]
        });
    }
}

export default new ReviewService();
