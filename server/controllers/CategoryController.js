import ApiError from '../error/ApiError.js'
import CategoryService from "../services/CategoryService.js";

class CategoryController {
    async getAllCategories(req, res, next) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createCategory(req, res, next) {
        try {
            const { name, filters = [], parentCategoryId = null } = req.body;
            if (!name) return next(ApiError.badRequest('Category name not specified'));

            await CategoryService.createCategory(name, filters, parentCategoryId);
            res.status(201).json({ message: 'Category created' });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateCategory(req, res, next) {
        try {
            const { id, name, filters = [] } = req.body;
            if (!id) return next(ApiError.badRequest('Category id not specified'));
            if (!name) return next(ApiError.badRequest('Category name not specified'));

            await CategoryService.updateCategory(id, name, filters);
            res.status(200).json('Category updated');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) return next(ApiError.badRequest('Category id not specified'));
            
            await CategoryService.deleteCategory(id);
            res.status(200).json('Category deleted');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}

export default new CategoryController();