import { Category, Product } from "../db/models.js";
import Translit from "../utils/translit.js";

class CategoryService {
    async getAllCategories() {
        return await Category.findAll({
            where: {
                categoryId: null,
            },
            order: ['id'],
            include: { model: Category }
        });
    }

    async createCategory(name, filters, parentCategoryId) {
        let translitedFilters = [];
        filters.map(filter => translitedFilters.push([Translit(filter), filter]));

        if (parentCategoryId) {
            await Category.update({ filters: null }, { where: { id: parentCategoryId } });
            await Product.update({ categoryId: null }, { where: { categoryId: parentCategoryId } });
        }
        await Category.create({ name, filters: translitedFilters, categoryId: parentCategoryId });
    }

    async updateCategory(id, name, filters) {
        let translitedFilters = [];
        filters.map(filter => translitedFilters.push([Translit(filter), filter]));

        await Category.update({ name, filters: translitedFilters }, { where: { id } });
    }

    async deleteCategory(id) {
        await Category.destroy({ where: { categoryId: id } })
        await Category.destroy({ where: { id } });
    }

    async getCategoryFilters(id) {
        let filters = {}
        await Category.findOne({ where: { id }, attributes: ['filters'] })
            .then(data => {
                data.dataValues.filters.map(filter => {
                    filters[filter[0]] = { $DISPLAY_FILTER_NAME: filter[1], values: {} };
                });
            });
        return filters;
    }
}

export default new CategoryService();