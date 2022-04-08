import Router from 'express';
const productRouter = new Router();
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js';
import ProductController from '../controllers/ProductController.js';

productRouter.post('/', authMiddleware, checkRoleMiddleware, ProductController.createProduct);
productRouter.put('/', authMiddleware, checkRoleMiddleware, ProductController.updateProduct);
productRouter.delete('/', authMiddleware, checkRoleMiddleware, ProductController.deleteProduct);

productRouter.get('/products', ProductController.getAllProducts);
productRouter.get('/product/:id', ProductController.getProduct);
productRouter.get('/available', ProductController.getAvailableFilters);
productRouter.get('/price', ProductController.getMinMaxPrices);
productRouter.get('/filters', ProductController.getCatalogFilters);

export default productRouter;