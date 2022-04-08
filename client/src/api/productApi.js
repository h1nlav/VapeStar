import { $authHost, $host } from ".";

export const createProduct = async (params) => {
    const { data } = await $authHost.post('/product/', params);
    return data;
}

export const updateProduct = async (params) => {
    const { data } = await $authHost.put('/product/', params);
    return data;
}

export const deleteProduct = async (params) => {
    const { data } = await $authHost.delete('/product/', { params });
    return data;
}

export const getAllProducts = async (params) => {
    const { data } = await $host.get('/product/products', { params });
    return data;
}

export const getProduct = async (id, params) => {
    const { data } = await $host.get('/product/product/' + id, { params });
    return data;
}

export const getAvailableFilters = async (params) => {
    const { data } = await $host.get('/product/available', { params });
    return data;
}

export const getMinMaxPrices = async (params) => {
    const { data } = await $host.get('/product/price', { params });
    return data;
}

export const getCatalogFilters = async (params) => {
    const { data } = await $host.get('/product/filters', { params });
    return data;
}