import { Op } from "sequelize";
import { DeliveryCity, DeliveryCompany, DeliveryDepartment, PaymentOptions } from "../db/models.js";

class DeliveryService {
    async createDeliveryCity(name) {
        await DeliveryCity.create({ name });
    }

    async updateDeliveryCity(id, name) {
        await DeliveryCity.update({ name }, { where: { id } });
    }

    async deleteDeliveryCity(id) {
        await DeliveryCity.destroy({ where: { id } });
    }

    async createDeliveryCompany(name) {
        await DeliveryCompany.create({ name });
    }

    async updateDeliveryCompany(id, name) {
        await DeliveryCompany.update({ name }, { where: { id } });
    }

    async deleteDeliveryCompany(id) {
        await DeliveryCompany.destroy({ where: { id } });
    }

    async createDeliveryDepartment(name, adress, deliveryCityId, deliveryCompanyId) {
        await DeliveryDepartment.create({ name, adress, deliveryCityId, deliveryCompanyId });
    }

    async updateDeliveryDepartment(id, name, adress, deliveryCityId, deliveryCompanyId) {
        await DeliveryDepartment.update({ name, adress, deliveryCityId, deliveryCompanyId }, { where: { id } });
    }

    async deleteDeliveryDepartment(id) {
        await DeliveryDepartment.destroy({ where: { id } });
    }

    async createPaymentOption(name) {
        await PaymentOptions.create({ name });
    }

    async updatePaymentOption(id, name) {
        await PaymentOptions.update({ name }, { where: { id } });
    }

    async deletePaymentOption(id) {
        await PaymentOptions.destroy({ where: { id } });
    }

    async getAdminDeliveryInfo() {
        const cities = await DeliveryCity.findAndCountAll({ order: [['id']] });
        const companies = await DeliveryCompany.findAndCountAll({ order: [['id']] });

        const departments = await DeliveryDepartment.findAndCountAll({
            where: { deliveryCityId: { [Op.not]: null }, deliveryCompanyId: { [Op.not]: null } },
            order: [['id']],
            include: [
                { model: DeliveryCity, attributes: ['id', 'name'] },
                { model: DeliveryCompany, attributes: ['id', 'name'] }
            ]
        });

        const departmentsRequiredChange = await DeliveryDepartment.findAndCountAll({
            where: { [Op.or]: [{ deliveryCityId: null }, { deliveryCompanyId: null }] },
            order: [['id']],
            include: [
                { model: DeliveryCity, attributes: ['id', 'name'] },
                { model: DeliveryCompany, attributes: ['id', 'name'] }
            ]
        });

        return { cities, companies, departments, departmentsRequiredChange };
    }

    async getOrderDeliveryInfo() {
        let delivery = {};
        await DeliveryCompany.findAll().then(async (companies) => {
            await Promise.all(companies.map(async (company) => {
                await DeliveryDepartment.findAll({
                    where: { deliveryCompanyId: company.id, deliveryCityId: { [Op.not]: null } },
                    include: { model: DeliveryCity, attributes: ['name'] }
                }).then(departments => {
                    departments = JSON.parse(JSON.stringify(departments));
                    departments.map(department => {
                        if (!delivery[company.id]) delivery[company.id] = { companyName: company.name, cities: {} };
                        if (!delivery[company.id].cities[department.deliveryCityId])
                            delivery[company.id].cities[department.deliveryCityId] = { cityName: department.delivery_city.name, departments: {} };

                        delivery[company.id].cities[department.deliveryCityId].departments[department.id] = {
                            name: department.name,
                            adress: department.adress
                        }
                    });
                });
            }));
        });
        return delivery;
    }

    async getAllPaymentOptions() {
        return await PaymentOptions.findAll({ order: [['id']] });
    }
}

export default new DeliveryService();