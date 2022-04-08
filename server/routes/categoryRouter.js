import Router from 'express';
const categoryRouter = new Router();
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js';
import CategoryController from '../controllers/CategoryController.js';

categoryRouter.get('/', CategoryController.getAllCategories);
categoryRouter.post('/', authMiddleware, checkRoleMiddleware, CategoryController.createCategory);
categoryRouter.put('/', authMiddleware, checkRoleMiddleware, CategoryController.updateCategory);
categoryRouter.delete('/', authMiddleware, checkRoleMiddleware, CategoryController.deleteCategory);

export default categoryRouter;