import ApiError from "../error/ApiError.js";
import OrderService from "../services/OrderService.js";


class OrderController {
    async createOrder(req, res, next) {
        try {
            const { name, surname, mobileNum, cityName, companyName, departmentName, paymentOptionName,
                deliveryDepartmentId, paymentOptionId, cart, userId = null, ordersStatusId = 1 } = req.body;

            if (!name || !surname || !mobileNum || !cityName || !companyName || !departmentName || !paymentOptionName
                || !deliveryDepartmentId || !paymentOptionId || !cart) return next(ApiError.badRequest('All fields must be filled'));

            await OrderService.createOrder({
                name, surname, mobileNum, cityName, companyName, departmentName, paymentOptionName,
                deliveryDepartmentId, paymentOptionId, cart, userId, ordersStatusId
            });

            res.status(201).json({ message: 'Order created' });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateOrder(req, res, next) {
        try {
            const { id, name, surname, mobileNum, cityName, companyName, departmentName, paymentOptionName,
                deliveryDepartmentId, paymentOptionId, cart, userId = null, ordersStatusId = 1 } = req.body;

            if (!id) return next(ApiError.badRequest('Order ID not specified'));
            if (!name || !surname || !mobileNum || !cityName || !companyName || !departmentName || !paymentOptionName
                || !deliveryDepartmentId || !paymentOptionId || !cart) return next(ApiError.badRequest('All fields must be filled'));

            await OrderService.updateOrder({
                id, name, surname, mobileNum, cityName, companyName, departmentName, paymentOptionName,
                deliveryDepartmentId, paymentOptionId, cart, userId, ordersStatusId
            });

            res.status(200).json({ message: 'Order updated' });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createStatus(req, res, next) {
        try {
            const { name, color } = req.body;
            if (!name || !color) return next(ApiError.badRequest('All fields must be filled'));
            await OrderService.createStatus(name, color);
            res.status(201).json({ message: 'Order status created' });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateStatus(req, res, next) {
        try {
            const { id, name, color } = req.body;
            if (!id) return next(ApiError.badRequest('Order status id not specified'));
            if (!name || !color) return next(ApiError.badRequest('All fields must be filled'));
            await OrderService.updateStatus(id, name, color);
            res.status(200).json({ message: 'Order status updated' });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteStatus(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) return next(ApiError.badRequest('Order status id not specified'));
            await OrderService.deleteStatus(id);
            res.status(200).json({ message: 'Order status deleted' });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getAllOrders(req, res, next) {
        try {
            res.status(200).json(await OrderService.getAllOrders());
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getOrdersById(req, res, next) {
        try {
            const { userId } = req.query;
            if (!userId) return next(ApiError.badRequest('User id not specified'));
            res.status(200).json(await OrderService.getOrdersById(userId));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}

export default new OrderController();