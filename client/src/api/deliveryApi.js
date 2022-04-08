import { $authHost, $host } from "."

export const createDeliveryCity = async (params) => {
    const { data } = await $authHost.post('/delivery/city', { ...params });
    return data;
}

export const updateDeliveryCity = async (params) => {
    const { data } = await $authHost.put('/delivery/city', { ...params });
    return data;
}

export const deleteDeliveryCity = async (params) => {
    const { data } = await $authHost.delete('/delivery/city', { params });
    return data;
}

export const createDeliveryCompany = async (params) => {
    const { data } = await $authHost.post('/delivery/company', { ...params });
    return data;
}

export const updateDeliveryCompany = async (params) => {
    const { data } = await $authHost.put('/delivery/company', { ...params });
    return data;
}

export const deleteDeliveryCompany = async (params) => {
    const { data } = await $authHost.delete('/delivery/company', { params });
    return data;
}

export const createDeliveryDepartment = async (params) => {
    const { data } = await $authHost.post('/delivery/department', { ...params });
    return data;
}

export const updateDeliveryDepartment = async (params) => {
    const { data } = await $authHost.put('/delivery/department', { ...params });
    return data;
}

export const deleteDeliveryDepartment = async (params) => {
    const { data } = await $authHost.delete('/delivery/department', { params });
    return data;
}

export const createPaymentOption = async (params) => {
    const { data } = await $authHost.post('/delivery/payment', { ...params });
    return data;
}

export const updatePaymentOption = async (params) => {
    const { data } = await $authHost.put('/delivery/payment', { ...params });
    return data;
}

export const deletePaymentOption = async (params) => {
    const { data } = await $authHost.delete('/delivery/payment', { params });
    return data;
}

export const getAdminDeliveryInfo = async () => {
    const { data } = await $authHost.get('/delivery/admin');
    return data;
}

export const getOrderDeliveryInfo = async () => {
    const { data } = await $host.get('/delivery/order');
    return data;
}

export const getAllPaymentOptions = async () => {
    const { data } = await $host.get('/delivery/payment');
    return data;
}