import Router from 'express';
const router = new Router();
import categoryRouter from './categoryRouter.js';
import productRouter from './productRouter.js';
import userRouter from './userRouter.js';
import reviewRouter from './reviewRouter.js';
import deliveryRouter from './deliveryRouter.js';
import cartRouter from './cartRouter.js';
import orderRouter from './orderRouter.js';

router.use('/category', categoryRouter);
router.use('/product', productRouter);
router.use('/user', userRouter);
router.use('/review', reviewRouter);
router.use('/delivery', deliveryRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);

export default router;