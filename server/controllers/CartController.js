import ApiError from "../error/ApiError.js";
import CartService from "../services/CartService.js";

class CartController {
    async syncCart(req, res, next) {
        try {
            let { userId, cart } = req.body;
            if (!userId) return next(ApiError.badRequest('User id not specified'));
            await CartService.syncCart(userId, cart);
            req.query.userId = userId;
            this.getCart(req, res, next);
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async updateCart(req, res, next) {
        const { userId, productId, quantity } = req.body;
        if (!userId) return next(ApiError.badRequest('User id not specified'));
        if (!productId || !quantity) return next(ApiError.badRequest('All fields must be filled'));
        await CartService.updateCart(userId, productId, quantity);
        return res.status(200).json('Cart updated');
    }

    async deleteCart(req, res, next) {
        try {
            const { userId, productId = null } = req.query;
            if (!userId) return next(ApiError.badRequest('User id not specified'));
            await CartService.deleteCart(userId, productId);
            res.status(200).json('Product removed from cart');
        } catch (err) {
            next(ApiError.badRequest(err.message));
        }
    }

    async getCart(req, res, next) {
        const { userId } = req.query;
        if (!userId) return next(ApiError.badRequest('User id not specified'));
        res.status(200).json(await CartService.getCart(userId));
    }
}

export default new CartController();