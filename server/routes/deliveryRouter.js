import Router from 'express';
const deliveryRouter = new Router();
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js';
import DeliveryController from '../controllers/DeliveryController.js';

deliveryRouter.post('/city', authMiddleware, checkRoleMiddleware, DeliveryController.createDeliveryCity);
deliveryRouter.put('/city', authMiddleware, checkRoleMiddleware, DeliveryController.updateDeliveryCity);
deliveryRouter.delete('/city', authMiddleware, checkRoleMiddleware, DeliveryController.deleteDeliveryCity);

deliveryRouter.post('/company', authMiddleware, checkRoleMiddleware, DeliveryController.createDeliveryCompany);
deliveryRouter.put('/company', authMiddleware, checkRoleMiddleware, DeliveryController.updateDeliveryCompany);
deliveryRouter.delete('/company', authMiddleware, checkRoleMiddleware, DeliveryController.deleteDeliveryCompany);

deliveryRouter.post('/department', authMiddleware, checkRoleMiddleware, DeliveryController.createDeliveryDepartment);
deliveryRouter.put('/department', authMiddleware, checkRoleMiddleware, DeliveryController.updateDeliveryDepartment);
deliveryRouter.delete('/department', authMiddleware, checkRoleMiddleware, DeliveryController.deleteDeliveryDepartment);

deliveryRouter.post('/payment', authMiddleware, checkRoleMiddleware, DeliveryController.createPaymentOption);
deliveryRouter.put('/payment', authMiddleware, checkRoleMiddleware, DeliveryController.updatePaymentOption);
deliveryRouter.delete('/payment', authMiddleware, checkRoleMiddleware, DeliveryController.deletePaymentOption);

deliveryRouter.get('/admin', authMiddleware, checkRoleMiddleware, DeliveryController.getAdminDeliveryInfo);
deliveryRouter.get('/order', DeliveryController.getOrderDeliveryInfo);
deliveryRouter.get('/payment', DeliveryController.getAllPaymentOptions);

export default deliveryRouter;