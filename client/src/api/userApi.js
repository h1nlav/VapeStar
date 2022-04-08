import jwtDecode from "jwt-decode";
import { $host, $authHost } from ".";
import { syncCart } from "./cartApi";

export const checkAuth = async () => {
    const { data } = await $authHost.get('/user/auth');
    if (data.token) {
        localStorage.setItem('token', data.token);
        await syncCart(jwtDecode(data.token).id);
    }
    return (data);
}

export const registration = async (params) => {
    let { data } = params.role === 'ADMIN'
        ? await $authHost.post('/user/registration', { ...params })
        : await $host.post('/user/registration', { ...params });
    return data;
}

export const activate = async (activationLink) => {
    const { data } = await $host.get('/user/activate/' + activationLink);
    if (data.token) {
        await syncCart(jwtDecode(data.token).id);
        localStorage.setItem('token', data.token);
    }
    return (data);
}

export const login = async (params) => {
    let { data } = await $host.post('/user/login', { ...params });
    if (data.token) {
        await syncCart(jwtDecode(data.token).id);
        localStorage.setItem('token', data.token);
    }
    return data;
}

export const createChangePasswordLink = async (params) => {
    const { data } = await $host.post('/user/createChangePasswordLink', { ...params });
    return (data);
}

export const checkChangePasswordLink = async (passwordLink) => {
    const { data } = await $host.get('/user/checkChangePasswordLink/' + passwordLink);
    return (data);
}

export const changePassword = async (params) => {
    const { data } = await $host.put('/user/changePassword', { ...params });
    return (data);
}

export const getUsers = async () => {
    const { data } = await $authHost.get('/user/users');
    return data;
}

export const getAdmins = async () => {
    const { data } = await $authHost.get('/user/admins');
    return data;
}

export const updateUserInfo = async (params, saveToken = true) => {
    const { data } = await $authHost.put('/user/', { ...params });
    if (data.token && saveToken) localStorage.setItem('token', data.token);
    return data;
}

export const deleteUser = async (params) => {
    const { data } = await $authHost.delete('/user/', { params });
    return data;
}

export const blockUser = async (params) => {
    const { data } = await $authHost.put('/user/block', { ...params });
    return data;
}

export const unblockUser = async (params) => {
    const { data } = await $authHost.put('/user/unblock', { ...params });
    return data;
}

export const checkMobileNum = async (params) => {
    const { data } = await $host.get('/user/checkMobileNum', { params });
    return (data);
}