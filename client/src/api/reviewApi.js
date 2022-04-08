import { $authHost, $host } from ".";

export const createReview = async (params) => {
    const { data } = await $authHost.post('/review/review', { ...params });
    return data;
}

export const deleteReview = async (params) => {
    const { data } = await $authHost.delete('/review/review', { params });
    return data;
}

export const createAnswer = async (params) => {
    const { data } = await $authHost.post('/review/answer', { ...params });
    return data;
}

export const deleteAnswer = async (params) => {
    const { data } = await $authHost.delete('/review/answer', { params });
    return data;
}

export const getReviewsByProductId = async (params) => {
    const { data } = await $host.get('/review/product', { params });
    return data;
}

export const getReviewsByUserId = async (params) => {
    const { data } = await $authHost.get('/review/user', { params });
    return data;
}

export const getAllReviews = async (params) => {
    const { data } = await $authHost.get('/review/', { params });
    return data;
}