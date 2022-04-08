import Router from 'express';
const cartRouter = new Router();
import CartController from '../controllers/CartController.js';

cartRouter.put('/sync', CartController.syncCart.bind(CartController));
cartRouter.put('/update', CartController.updateCart);
cartRouter.delete('/', CartController.deleteCart);

export default cartRouter;