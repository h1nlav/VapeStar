import { $host } from ".";

export const addCart = async (userId, params) => {
    let localStorageCart = JSON.parse(localStorage.getItem('cart')) || [];
    let isProductExist = false;

    for await (let cartItem of localStorageCart) {
        if (cartItem.productId == params.productId) {
            cartItem.quantity = parseInt(cartItem.quantity) + 1;
            isProductExist = true;
            break;
        }
    }
    if (!isProductExist) localStorageCart.push({ ...params });

    if (userId) await syncCart(userId, JSON.stringify(localStorageCart));
    else localStorage.setItem('cart', JSON.stringify(localStorageCart));
}

export const syncCart = async (userId, cart = null) => {
    if (!cart) cart = localStorage.getItem('cart') || [];
    let { data } = await $host.put('/cart/sync', { userId, cart });
    localStorage.setItem('cart', JSON.stringify(data));
}

export const updateCart = async (userId, productId, quantity) => {
    let localStorageCart = JSON.parse(localStorage.getItem('cart'));
    localStorageCart.map(localStorageEl => {
        if (localStorageEl.productId === productId)
            localStorageEl.quantity = quantity;
    })
    localStorage.setItem('cart', JSON.stringify(localStorageCart));

    if (userId) {
        await $host.put('/cart/update', { userId, productId, quantity });
        await syncCart(userId);
    }

}

export const deleteCart = async (userId, productId = null) => {
    if (!productId) localStorage.removeItem('cart');
    else {
        let localStorageCart = JSON.parse(localStorage.getItem('cart'));
        if (!localStorageCart) localStorageCart = [];
        localStorageCart = await localStorageCart.filter(localStorageEl => localStorageEl.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(localStorageCart));
    }

    if (userId) {
        await $host.delete('/cart/', { params: { userId, productId } });
        await syncCart(userId);
    }
}