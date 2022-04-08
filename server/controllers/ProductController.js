import ApiError from '../error/ApiError.js'
import ProductService from "../services/ProductService.js";

class ProductController {
    async createProduct(req, res, next) {
        try {
            const { name, description, price, isAvailable, info, categoryId } = req.body;
            if (!name || !description || !price || !isAvailable || !categoryId) return next(ApiError.badRequest('All fields must be filled'));
            if (!req.files.img) return next(ApiError.badRequest('Need to add photos'));

            await ProductService.createProduct(name, description, price, isAvailable, info, categoryId, req.files.img)
            res.status(201).json({ message: 'Product created' });
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateProduct(req, res, next) {
        try {
            let { id, categoryId, name, description, price, isAvailable, info, oldPics } = req.body;
            oldPics = JSON.parse(oldPics) || [];
            let newPics = [];
            if (req.files && req.files.newPics) newPics = Array.isArray(req.files.newPics) ? [...req.files.newPics] : [req.files.newPics];

            if (!id) return next(ApiError.badRequest('Product ID not specified'));
            if (!name || !description || !price || !isAvailable || !categoryId) return next(ApiError.badRequest('All fields must be filled'));
            if (oldPics.length === 0 && newPics.length == 0) return next(ApiError.badRequest('Need to add photos'));

            await ProductService.updateProduct(id, categoryId, name, description, price, isAvailable, info, oldPics, newPics);
            res.status(200).json('Product updated');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) return next(ApiError.badRequest('Product ID not specified'));
            await ProductService.deleteProduct(id);
            res.status(200).json('Product removed');
        } catch (err) {
            next(ApiError.internal(err.message));
            console.log(err.message)
        }
    }

    async getAllProducts(req, res, next) {
        try {
            let { fetchOption = 'main', order = 'new', page = 1, limit = 60, search = '', categoryId,
                minPrice = null, maxPrice = null, isAvailable = [true, false], ...params } = req.query;

            if (fetchOption == 'main') return res.status(200).json(await ProductService.getAllMainProducts());
            else if (fetchOption == 'search') return res.status(200).json(await ProductService.getAllSearchProducts(search, minPrice, maxPrice, isAvailable, order, page, limit));
            else if (fetchOption == 'admin') return res.status(200).json(await ProductService.getAllAdminProducts());
            else if (fetchOption == 'catalog') {
                if (!categoryId) return next(ApiError.badRequest('Category id not specified'));
                return res.status(200).json(await ProductService.getAllCatalogProducts(categoryId, minPrice, maxPrice, isAvailable, order, page, limit, params));
            } else next(ApiError.badRequest('Unintended product selection option'));

        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getProduct(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) return next(ApiError.badRequest('Product ID not specified'));

            let { changeViews } = req.query;
            changeViews = changeViews === 'true' ? true : false;
            res.status(200).json(await ProductService.getProduct(id, changeViews));
        } catch (err) {
            next(ApiError.internal(err.message));
        }

    }

    async getCatalogFilters(req, res, next) {
        try {
            let { categoryId, minPrice = null, maxPrice = null, isAvailable = [true, false], ...params } = req.query;
            if (!categoryId) return next(ApiError.badRequest('Category id not specified'));
            res.status(200).json(await ProductService.getCatalogFilters(categoryId, minPrice, maxPrice, isAvailable, params));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getAvailableFilters(req, res, next) {
        try {
            let { fetchOption, categoryId, search = null, minPrice = null, maxPrice = null, ...params } = req.query;

            if (!fetchOption) return next(ApiError.badRequest('Item status fetch option not specified'));
            else if (fetchOption !== 'catalog' && fetchOption !== 'search') return next(ApiError.badRequest('Unintended fetch option of product statuses'));
            else if (fetchOption === 'catalog' && !categoryId) return next(ApiError.badRequest('Category id not specified'));

            res.status(200).json(await ProductService.getAvailableFilters(fetchOption, categoryId, search, minPrice, maxPrice, params));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getMinMaxPrices(req, res, next) {
        try {
            let { fetchOption, categoryId, search = null, isAvailable = [true, false], ...params } = req.query;

            if (!fetchOption) return res.json({ minPrice: -1, maxPrice: -1 });
            else if (fetchOption !== 'catalog' && fetchOption !== 'search') return res.json({ minPrice: -1, maxPrice: -1 });
            else if (fetchOption === 'catalog' && !categoryId) return res.json({ minPrice: -1, maxPrice: -1 });

            res.status(200).json(await ProductService.getMinMaxPrices(fetchOption, categoryId, search, isAvailable, params));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }
}

export default new ProductController();
