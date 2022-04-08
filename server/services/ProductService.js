import * as path from 'path';
import { fileURLToPath } from 'url';
import * as uuid from 'uuid';
import * as fs from 'fs'
import { Op, Sequelize } from "sequelize";
import Translit from "../utils/translit.js";
import { Product, ProductPic } from "../db/models.js";
import CategoryService from './CategoryService.js';

class ProductService {
    constructor() {
        this.dirname = path.dirname(fileURLToPath(import.meta.url));

        this.normalizeOrder = (order) => {
            if (order === 'new') return [['isAvailable', 'DESC'], ['createdAt', 'DESC'], [ProductPic, "seqNum"]];
            else if (order === 'cheap') return [['isAvailable', 'DESC'], ['price'], [ProductPic, "seqNum"]];
            else if (order === 'expencive') return [['isAvailable', 'DESC'], ['price', 'DESC'], [ProductPic, "seqNum"]];
            else if (order === 'rating') return [['isAvailable', 'DESC'], [Sequelize.literal('"avgRating"'), 'DESC'], [ProductPic, "seqNum"]];
            else if (order === 'popular') return [['isAvailable', 'DESC'], ['views', 'DESC'], [ProductPic, "seqNum"]];
        }

        this.countOffset = (page, limit) => {
            return page * limit - limit
        }
    }


    async createProduct(name, description, price, isAvailable, info, categoryId, images) {
        images = Array.isArray(images) ? [...images] : [images];

        let translitedInfo = {};
        JSON.parse(info).map(el => translitedInfo[Translit(el[0])] = { $INFO_NAME: el[0], $INFO_VALUE: el[1], value: Translit(el[1]) });

        const product = await Product.create({
            name, description, price, isAvailable,
            info: translitedInfo, views: 0, categoryId
        });

        images.map(async (img, index) => {
            let fileName = uuid.v4() + '.jpg';
            img.mv(path.resolve(this.dirname, '..', 'static', fileName));
            await ProductPic.create({ fileName, seqNum: index + 1, productId: product.id })
        })
    }


    async updateProduct(id, categoryId, name, description, price, isAvailable, info, oldPics, newPics) {
        let translitedInfo = {};
        JSON.parse(info).map(el => translitedInfo[Translit(el[0])] = { $INFO_NAME: el[0], $INFO_VALUE: el[1], value: Translit(el[1]) });

        await Product.update(
            { categoryId, name, description, price, isAvailable, info: translitedInfo },
            { where: { id } }
        );

        await ProductPic.findAll({ where: { productId: id } })
            .then(existedPics => {
                existedPics.map(async (existedPic) => {
                    let seqNum = -1;
                    Promise.all(oldPics.map((oldPic, index) => {
                        if (oldPic.fileName == existedPic.fileName) seqNum = index + 1;
                    })).then(async () => {
                        if (seqNum === -1) {
                            await ProductPic.destroy({ where: { id: existedPic.id } });
                            try {
                                fs.unlinkSync(path.resolve(this.dirname, '..', 'static', existedPic.fileName));
                            } catch { }
                        } else {
                            await ProductPic.update({ seqNum }, { where: { id: existedPic.id } });
                        }
                    })
                })
            })

        if (newPics.length !== 0) {
            let seqNum = 0;
            await ProductPic.findOne({
                where: { productId: id },
                order: [['seqNum', 'DESC']],
            }).then(data => { if (data) seqNum = data.seqNum });

            newPics.map(async (newPic) => {
                let fileName = uuid.v4() + '.jpg';
                newPic.mv(path.resolve(this.dirname, '..', 'static', fileName));
                seqNum += 1;
                await ProductPic.create({ fileName, seqNum, productId: id })
            })
        }
    }


    async deleteProduct(id) {
        await ProductPic.findAll({ where: { productId: id } }).then(async (picsArray) =>
            picsArray.map(pic => {
                try {
                    fs.unlinkSync(path.resolve(this.dirname, '..', 'static', pic.fileName));
                } catch { }
            }))

        await Product.destroy({ where: { id } });
    }


    async getAllMainProducts() {
        return {
            products: await Product.findAll({
                attributes: ['id', 'name', 'price', 'views', 'isAvailable', 'createdAt',
                    [Sequelize.literal('(SELECT COUNT(*) FROM reviews WHERE "productId" = products.id)'), 'countRating'],
                    [Sequelize.literal('(SELECT AVG(rating) FROM reviews WHERE "productId" = products.id)'), 'avgRating'],
                ],
                where: { isAvailable: true },
                order: this.normalizeOrder('popular'),
                include: {
                    model: ProductPic,
                    attributes: ['fileName', 'seqNum'],
                    where: { seqNum: [1, 2] },
                    order: ['seqNum'],
                },
                limit: 60
            })
        };
    }


    async getAllSearchProducts(search, minPrice, maxPrice, isAvailable, order, page, limit) {
        search = '%' + search.replace(' ', "%").replace('+', "%") + '%';
        const dbParams = { name: { [Op.iLike]: `%${search}%` }, isAvailable }
        if (minPrice, maxPrice) dbParams.price = { [Op.between]: [minPrice, maxPrice] };

        const products = {};
        products.isResultsExist = await Product.count({ where: { name: { [Op.iLike]: `%${search}%` } } }) !== 0;
        products.count = await Product.count({ where: dbParams });
        products.products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'views', 'isAvailable', 'createdAt',
                [Sequelize.literal('(SELECT COUNT(*) FROM reviews WHERE "productId" = products.id)'), 'countRating'],
                [Sequelize.literal('(SELECT AVG(rating) FROM reviews WHERE "productId" = products.id)'), 'avgRating'],
            ],
            where: dbParams,
            order: this.normalizeOrder(order),
            offset: this.countOffset(page, limit),
            limit,
            include: {
                model: ProductPic,
                where: { seqNum: [1, 2] },
            },
        });

        return products;
    }


    async getAllAdminProducts() {
        const products = {};
        const productsRequiredChange = {};

        products.count = await Product.count({ where: { categoryId: { [Op.not]: null } } });
        products.rows = await Product.findAll({
            where: { categoryId: { [Op.not]: null } },
            order: [['categoryId'], ['isAvailable', 'DESC'], [ProductPic, "seqNum"]],
            include: {
                model: ProductPic,
                attributes: ['fileName', 'seqNum'],
            }
        });

        productsRequiredChange.count = await Product.count({ where: { categoryId: null } });
        productsRequiredChange.rows = await Product.findAll({
            where: { categoryId: null, },
            order: [['categoryId'], ['isAvailable', 'DESC'], [ProductPic, "seqNum"]],
            include: {
                model: ProductPic,
                attributes: ['fileName', 'seqNum'],
            }
        });

        return { products, productsRequiredChange };
    }


    async getAllCatalogProducts(categoryId, minPrice, maxPrice, isAvailable, order, page, limit, params) {
        for (const [key, choice] of Object.entries(params)) params[key] = Array.isArray(choice) ? [...choice] : [choice];

        let info = {};
        for (const [key, choice] of Object.entries(params)) info[key] = { value: { [Op.in]: choice } };

        const dbParams = { categoryId, isAvailable, info, };
        if (minPrice, maxPrice) dbParams.price = { [Op.between]: [minPrice, maxPrice] };

        const count = await Product.count({ where: dbParams })
        const products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'views', 'isAvailable', 'createdAt',
                [Sequelize.literal('(SELECT COUNT(*) FROM reviews WHERE "productId" = products.id)'), 'countRating'],
                [Sequelize.literal('(SELECT AVG(rating) FROM reviews WHERE "productId" = products.id)'), 'avgRating'],
            ],
            where: dbParams,
            order: this.normalizeOrder(order),
            offset: this.countOffset(page, limit),
            limit,
            include: {
                model: ProductPic,
                attributes: ['fileName', 'seqNum'],
                where: { seqNum: [1, 2] },
            }
        });

        return { count, products };
    }


    async getProduct(id, changeViews) {
        let product = await Product.findOne({
            attributes: {
                include: [
                    [Sequelize.literal('(SELECT COUNT(*) FROM reviews WHERE "productId" = products.id)'), 'countRating'],
                    [Sequelize.literal('(SELECT AVG(rating) FROM reviews WHERE "productId" = products.id)'), 'avgRating'],
                ]
            },
            where: { id },
            order: [[ProductPic, "seqNum"]],
            include: { model: ProductPic }
        });

        if (!product) product = {};
        if (changeViews) await Product.update({ views: product.views + 1 }, { where: { id } });

        return product;
    }


    async getCatalogFilters(categoryId, minPrice, maxPrice, isAvailable, params) {
        for (const [key, choice] of Object.entries(params)) params[key] = Array.isArray(choice) ? [...choice] : [choice];

        const addFilters = (products) => {
            products = JSON.parse(JSON.stringify(products));
            products.map(product => {
                for (const [productInfoKey, productInfoValues] of Object.entries(product.info)) {
                    for (const filterKey of Object.keys(filters)) {
                        if (productInfoKey === filterKey) {
                            filters[filterKey].values[productInfoValues.value]
                                ? filters[filterKey].values[productInfoValues.value].count += 1
                                : filters[filterKey].values[productInfoValues.value] = {
                                    $DISPLAY_VALUE_NAME: productInfoValues.$INFO_VALUE,
                                    count: 1
                                }
                        }
                    }
                }
            })
        }

        let filters = await CategoryService.getCategoryFilters(categoryId);

        const dbParams = { categoryId, isAvailable };
        if (minPrice, maxPrice) dbParams.price = { [Op.between]: [minPrice, maxPrice] };

        let info = {};
        for await (const [key, choice] of Object.entries(params)) info[key] = { value: { [Op.in]: choice } };

        await Product.findAll({
            attributes: ['info'],
            raw: true,
            where: { ...dbParams, info }
        }).then(products => addFilters(products));

        for await (const filterKey of Object.keys(params)) {
            let info = {};
            for (const [key, choice] of Object.entries(params)) {
                if (key !== filterKey) info[key] = { value: { [Op.in]: choice } };
                else info[key] = { value: { [Op.notIn]: choice } };
            }

            await Product.findAll({
                attributes: ['info'],
                raw: true,
                where: { ...dbParams, info }
            }).then(products => {
                products.map(product => {
                    Object.keys(product.info).map(infoKey => infoKey !== filterKey && delete product.info[infoKey]);
                })
                addFilters(products);
            })
        }

        for await (const [key, choices] of Object.entries(params)) {
            for await (let choice of choices) {
                if (filters[key] && filters[key].values[choice]) filters[key].values[choice].count = 0
                else {
                    await Product.findOne({
                        attributes: ['info'],
                        raw: true,
                        where: { info: { [key]: { value: choice } } },
                    }).then(product => {
                        if (!filters[key]) filters[key] = { $DISPLAY_FILTER_NAME: product.info[key].$INFO_NAME, values: {} };
                        filters[key].values[choice] = {
                            $DISPLAY_VALUE_NAME: product.info[key].$INFO_VALUE,
                            count: 0
                        }
                    })
                }
            }
        }

        return filters;
    }


    async getAvailableFilters(fetchOption, categoryId, search, minPrice, maxPrice, params) {
        let price = minPrice && maxPrice ? { [Op.between]: [minPrice, maxPrice] } : { [Op.ne]: null };

        for await (const [key, choice] of Object.entries(params)) params[key] = Array.isArray(choice) ? [...choice] : [choice];
        let info = {};
        for await (const [key, choice] of Object.entries(params)) info[key] = { value: { [Op.in]: choice } };

        let dbParams;
        if (fetchOption === 'catalog') dbParams = { categoryId, price, info };
        else if (fetchOption === 'search') dbParams = { name: { [Op.iLike]: '%' + search.replace(' ', "%").replace('+', "%") + '%' }, price, info };

        let availableCount = await Product.count({ where: { isAvailable: true, ...dbParams }, });
        let notAvailableCount = await Product.count({ where: { isAvailable: false, ...dbParams }, });

        return { availableCount, notAvailableCount };
    }


    async getMinMaxPrices(fetchOption, categoryId, search, isAvailable, params) {
        for await (const [key, choice] of Object.entries(params)) params[key] = Array.isArray(choice) ? [...choice] : [choice];
        let info = {};
        for await (const [key, choice] of Object.entries(params)) info[key] = { value: { [Op.in]: choice } };

        let dbParams;
        if (fetchOption === 'catalog') dbParams = { categoryId, isAvailable, info };
        else if (fetchOption === 'search') dbParams = { name: { [Op.iLike]: '%' + search.replace(' ', "%").replace('+', "%") + '%' }, isAvailable, info };

        let minPrice = -1;
        let maxPrice = -1;

        await Product.findOne({ where: dbParams, order: [['price']] })
            .then(data => { if (data && data.dataValues && data.dataValues.price) minPrice = data.dataValues.price });
        await Product.findOne({ where: dbParams, order: [['price', 'DESC']] })
            .then(data => { if (data && data.dataValues && data.dataValues.price) maxPrice = data.dataValues.price });

        return { minPrice, maxPrice };
    }

}

export default new ProductService();
