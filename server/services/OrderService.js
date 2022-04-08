import { DeliveryCity, DeliveryCompany, DeliveryDepartment, Order, OrderProduct, OrderStatus, PaymentOptions } from "../db/models.js";

class OrderService {
    async createOrder({ name, surname, mobileNum, cityName, companyName, departmentName, paymentOptionName,
        deliveryDepartmentId, paymentOptionId, cart, userId, ordersStatusId }) {

        const order = await Order.create({
            name, surname, mobileNum, cityName, companyName, departmentName,
            paymentOptionName, ordersStatusId, userId, deliveryDepartmentId, paymentOptionId
        });

        cart.map(async (product) => {
            await OrderProduct.create({
                productId: product.productId,
                name: product.productName,
                price: product.productPrice,
                fileName: product.productPic,
                quantity: product.quantity,
                orderId: order.id
            });
        });
    }

    async updateOrder({ id, name, surname, mobileNum, cityName, companyName, departmentName, paymentOptionName,
        deliveryDepartmentId, paymentOptionId, cart, userId, ordersStatusId }) {

        await Order.update({
            name, surname, mobileNum,
            cityName, companyName, departmentName, paymentOptionName,
            ordersStatusId, userId, deliveryDepartmentId, paymentOptionId
        }, { where: { id } });

        await OrderProduct.destroy({ where: { orderId: id } });
        cart.map(async (product) => {
            await OrderProduct.create({
                productId: product.productId,
                name: product.name,
                price: product.price,
                fileName: product.fileName,
                quantity: product.quantity,
                orderId: id
            });
        })
    }

    async createStatus(name, color) {
        await OrderStatus.create({ name, color });
    }

    async updateStatus(id, name, color) {
        await OrderStatus.update({ name, color }, { where: { id } });
    }

    async deleteStatus(id) {
        await Order.update({ ordersStatusId: 1 }, { where: { ordersStatusId: id } });
        await OrderStatus.destroy({ where: { id } });
    }

    async getAllOrders(req, res, next) {
        const orders = await Order.findAll({
            attributes: ['id', 'name', 'surname', 'cityName', 'companyName', 'departmentName', 'paymentOptionName', 'mobileNum', 'createdAt'],
            order: [['createdAt', 'DESC']],
            include: [
                { model: OrderProduct, attributes: ['id', 'name', 'price', 'fileName', 'quantity', 'productId'] },
                { model: OrderStatus, attributes: ['id', 'name', 'color'] },
                { model: PaymentOptions, attributes: ['id'] },
                {
                    model: DeliveryDepartment,
                    attributes: ['id'],
                    include: [
                        { model: DeliveryCompany, attributes: ['id'] },
                        { model: DeliveryCity, attributes: ['id'] }
                    ]
                }
            ]
        });
        const statuses = await OrderStatus.findAll({ order: [['id']] });

        return { orders, statuses };
    }

    async getOrdersById(userId) {
        return await Order.findAll({
            where: { userId },
            attributes: ['id', 'name', 'surname', 'cityName', 'companyName', 'departmentName', 'paymentOptionName', 'mobileNum', 'createdAt'],
            order: [['createdAt', 'DESC']],
            include: [
                { model: OrderProduct, attributes: ['id', 'name', 'price', 'fileName', 'quantity', 'productId'] },
                { model: OrderStatus, attributes: ['id', 'name', 'color'] }
            ]
        });
    }
}

export default new OrderService();