import ApiError from '../error/ApiError.js'
import DeliveryService from '../services/DeliveryService.js';

class DeliveryController {
    async createDeliveryCity(req, res, next) {
        try {
            const { name } = req.body;
            if (!name) return next(ApiError.badRequest('City name not specified'));
            await DeliveryService.createDeliveryCity(name);
            res.status(201).json('Delivery city created');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateDeliveryCity(req, res, next) {
        try {
            const { id, name } = req.body;
            if (!id) return next(ApiError.badRequest('City id not specified'));
            if (!name) return next(ApiError.badRequest('City name not specified'));
            await DeliveryService.updateDeliveryCity(id, name);
            res.status(200).json('Delivery city updated');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteDeliveryCity(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) return next(ApiError.badRequest('City id not specified'));
            await DeliveryService.deleteDeliveryCity(id);
            res.status(201).json('Delivery city removed');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createDeliveryCompany(req, res, next) {
        try {
            const { name } = req.body;
            if (!name) return next(ApiError.badRequest('Company name not specified'));
            await DeliveryService.createDeliveryCompany(name);
            res.status(201).json('Delivery company created');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateDeliveryCompany(req, res, next) {
        try {
            const { id, name } = req.body;
            if (!id) return next(ApiError.badRequest('Company ID not specified'));
            if (!name) return next(ApiError.badRequest('Company name not specified'));
            await DeliveryService.updateDeliveryCompany(id, name);
            res.status(200).json('Delivery company updated');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteDeliveryCompany(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) return next(ApiError.badRequest('Company ID not specified'));
            await DeliveryService.deleteDeliveryCompany(id);
            res.status(201).json('Delivery company removed');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createDeliveryDepartment(req, res, next) {
        try {
            const { name, adress, deliveryCityId, deliveryCompanyId } = req.body;
            if (!name || !adress || !deliveryCityId || !deliveryCompanyId) return next(ApiError.badRequest('All fields must be filled'));
            await DeliveryService.createDeliveryDepartment(name, adress, deliveryCityId, deliveryCompanyId);
            res.status(201).json('Delivery department created');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateDeliveryDepartment(req, res, next) {
        try {
            const { id, name, adress, deliveryCityId, deliveryCompanyId } = req.body;
            if (!id) return next(ApiError.badRequest('Department ID not specified'));
            if (!name || !adress || !deliveryCityId || !deliveryCompanyId) return next(ApiError.badRequest('All fields must be filled'));
            await DeliveryService.updateDeliveryDepartment(id, name, adress, deliveryCityId, deliveryCompanyId);
            res.status(201).json('Delivery department updated');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteDeliveryDepartment(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) return next(ApiError.badRequest('Department ID not specified'));
            await DeliveryService.deleteDeliveryDepartment(id);
            res.status(200).json('Delivery office removed');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createPaymentOption(req, res, next) {
        try {
            const { name } = req.body;
            if (!name) return next(ApiError.badRequest('Payment option name not specified'));
            await DeliveryService.createPaymentOption(name);
            res.status(201).json('Payment option created');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updatePaymentOption(req, res, next) {
        try {
            const { id, name } = req.body;
            if (!id) return next(ApiError.badRequest('Payment option ID not specified'));
            if (!name) return next(ApiError.badRequest('Payment option name not specified'));
            await DeliveryService.updatePaymentOption(id, name);
            res.status(200).json('Payment option updated');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deletePaymentOption(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) return next(ApiError.badRequest('Payment option ID not specified'));
            await DeliveryService.deletePaymentOption(id);
            res.status(200).json('Payment option removed');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getAdminDeliveryInfo(req, res, next) {
        try {
            res.status(200).json(await DeliveryService.getAdminDeliveryInfo());
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getOrderDeliveryInfo(req, res, next) {
        try {
            res.status(200).json(await DeliveryService.getOrderDeliveryInfo());
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getAllPaymentOptions(req, res, next) {
        try {
            res.status(200).json(await DeliveryService.getAllPaymentOptions());
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}

export default new DeliveryController();

