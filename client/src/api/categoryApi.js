import { $authHost, $host } from "."

export const getAllCategories = async() => {
    const {data} = await $host.get('/category/');
    return data;
}

export const createCategory = async(params) => {
    const {data} = await $authHost.post('/category/', params);
    return data;
}

export const updateCategory = async(params) => {
    const {data} = await $authHost.put('/category/', params);
    return data;
}

export const deleteCategory = async(params) => {
    const {data} = await $authHost.delete('/category/', {params});
    return data;
}

