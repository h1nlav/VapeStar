import { $host, $authHost } from "."

export const createOrder = async (params) => {
    const { data } = await $host.post('/order/order', { ...params });
    return data;
}

export const updateOrder = async (params) => {
    const { data } = await $host.put('/order/order', { ...params });
    return data;
}

export const createStatus = async (params) => {
    const { data } = await $authHost.post('/order/status', { ...params });
    return data;
}
export const updateStatus = async (params) => {
    const { data } = await $authHost.put('/order/status', { ...params });
    return data;
}
export const deleteStatus = async (params) => {
    const { data } = await $authHost.delete('/order/status', { params });
    return data;
}

export const getAllOrders = async () => {
    const { data } = await $authHost.get('/order/admin', {});
    return data;
}

export const getOrdersById = async (params) => {
    const { data } = await $authHost.get('/order/user', { params });
    return data;
}

