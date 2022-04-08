import { Cart, Product, ProductPic } from "../db/models.js";

class CartService {
    async syncCart(userId, cart) {
        cart = cart.length > 0 ? JSON.parse(cart) : [];
        for await (let cartField of cart) {
            try {
                await Cart.findOne({ where: { userId, productId: cartField.productId } })
                    .then(async (existedCart) => {
                        if (!existedCart) await Cart.create({ userId, productId: cartField.productId, quantity: cartField.quantity });
                        else if (existedCart && existedCart.quantity !== cartField.quantity)
                            await Cart.update({ quantity: cartField.quantity }, { where: { id: existedCart.id } });
                    });
            } catch {
                continue;
            }
        }
    }

    async updateCart(userId, productId, quantity) {
        await Cart.update({ quantity }, { where: { userId, productId } });
    }

    async deleteCart(userId, productId) {
        if (!productId) await Cart.destroy({ where: { userId } });
        else await Cart.destroy({ where: { userId, productId } });
    }

    async getCart(userId) {
        let carts = [];

        await Cart.findAll({
            where: { userId },
            attributes: ['userId', 'productId', 'quantity'],
            order: ['createdAt'],
            include: {
                model: Product, attributes: [['name', 'productName'], ['price', 'productPrice']],
                include: { model: ProductPic, where: { seqNum: 1 }, attributes: [['fileName', 'productPic']] }
            }
        }).then(data => {
            JSON.parse(JSON.stringify(data)).map(cart => {
                carts.push({
                    userId: cart.userId,
                    productId: cart.productId,
                    quantity: cart.quantity,
                    productName: cart.product.productName,
                    productPrice: cart.product.productPrice,
                    productPic: cart.product.products_pics[0].productPic,
                });
            });
        });

        return carts;
    }
}

export default new CartService();