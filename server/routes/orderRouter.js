import Router from 'express';
const orderRouter = new Router();
import OrderController from '../controllers/OrderController.js';
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';

orderRouter.post('/order', OrderController.createOrder);
orderRouter.put('/order', OrderController.updateOrder);

orderRouter.post('/status', authMiddleware, checkRoleMiddleware, OrderController.createStatus);
orderRouter.put('/status', authMiddleware, checkRoleMiddleware, OrderController.updateStatus);
orderRouter.delete('/status', authMiddleware, checkRoleMiddleware, OrderController.deleteStatus);

orderRouter.get('/admin', authMiddleware, checkRoleMiddleware, OrderController.getAllOrders);
orderRouter.get('/user', authMiddleware, OrderController.getOrdersById);

export default orderRouter;