import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import { Op } from 'sequelize';
import { User, UserEmails } from "../db/models.js";
import MailService from '../services/MailService.js';

class UserService {
    constructor() {
        this.generateJwt = (id, name, surname, email, mobileNum, role, isBlocked) => {
            return jwt.sign(
                { id, name, surname, email, mobileNum, role, isBlocked },
                process.env.JWT_KEY,
                { expiresIn: '24h' }
            );
        }
    }


    async checkAuth(id) {
        const user = await User.findOne({ where: { id } });
        if (!user) return {};
        return { token: this.generateJwt(user.id, user.name, user.surname, user.email, user.mobileNum, user.role, user.isBlocked) };
    }


    async reqistration(name, surname, mobileNum, email, password, role) {
        let alerts = {}
        let candidate = await User.findOne({ where: { mobileNum } });
        if (candidate) alerts.mobileNum = 'A user with this phone number is already registered';
        candidate = await User.findOne({ where: { email } });
        if (candidate) alerts.email = 'User with this email is already registered';
        if (Object.keys(alerts).length !== 0) return { ...alerts };

        if (role === 'ROOT') {
            let candidate = await User.findOne({ role: 'ROOT' });
            if (candidate) role = 'USER';
        } else if (role !== 'USER' && role !== 'ADMIN') role = 'USER';

        const hashPassword = await bcrypt.hash(password, 7);
        const user = await User.create({ name, surname, mobileNum, email, role, password: hashPassword, isBlocked: false, isActivated: false });

        const activationLink = uuid.v4();
        await UserEmails.create({ userId: user.id, link: activationLink, option: 'registration' });
        MailService.sendActivationMail(user.email, process.env.APP_URL + 'activate/' + activationLink);

        return { confirmation: true };
    }


    async activateUser(link) {
        const candidate = await UserEmails.findOne({ where: { link, option: 'registration' } });
        if (!candidate) return { alert: true };

        await UserEmails.destroy({ where: { link } });
        await User.update({ isActivated: true }, { where: { id: candidate.userId } });

        const user = await User.findOne({ where: { id: candidate.userId } })
        return { token: this.generateJwt(user.id, user.name, user.surname, user.email, user.mobileNum, user.role, user.isBlocked) };
    }


    async login(login, password) {
        const user = await User.findOne({ where: { [Op.or]: { email: login, mobileNum: login } } });

        if (!user) return { login: `User with login ${login} is not registered` };
        if (!bcrypt.compareSync(password, user.password)) return { password: 'Wrong password entered' };
        if (user.isBlocked) return { login: `User with login ${login} is blocked` };

        if (!user.isActivated) {
            await UserEmails.destroy({ where: { userId: user.id, option: 'registration' } });
            const activationLink = uuid.v4();
            await UserEmails.create({ userId: user.id, link: activationLink, option: 'registration' });
            MailService.sendActivationMail(user.email, process.env.APP_URL + 'activate/' + activationLink);
            return { activation: true };
        }

        return { token: this.generateJwt(user.id, user.name, user.surname, user.email, user.mobileNum, user.role, user.isBlocked) };
    }


    async createChangePasswordLink(login) {
        const candidate = await User.findOne({ where: { [Op.or]: { email: login, mobileNum: login } } });
        if (!candidate) return { login: 'User with this login was not found' };

        await UserEmails.destroy({ where: { userId: candidate.id, option: 'changePassword' } })
        const activationLink = uuid.v4();
        await UserEmails.create({ userId: candidate.id, link: activationLink, option: 'changePassword' });
        MailService.sendChangePasswordMail(candidate.email, process.env.APP_URL + 'changepassword/' + activationLink);
        return { confirmation: true };
    }


    async checkChangePasswordLink(link) {
        const candidate = await UserEmails.findOne({ where: { link, option: 'changePassword' } });
        if (!candidate) return {};
        return { confirmation: true };
    }


    async changePassword(link, password) {
        const candidate = await UserEmails.findOne({ where: { link, option: 'changePassword' } });
        if (!candidate) return {};

        const hashPassword = await bcrypt.hash(password, 7);
        await User.update({ isActivated: true, password: hashPassword }, { where: { id: candidate.userId } });
        await UserEmails.destroy({ where: { userId: candidate.userId } });
        return { confirmation: true };
    }


    async getUsers() {
        let users = await User.findAndCountAll({ where: { role: 'USER', isBlocked: false }, order: [['id']] });
        let blockedUsers = await User.findAndCountAll({ where: { role: 'USER', isBlocked: true }, order: [['id']] });
        return { users, blockedUsers }
    }


    async getAdmins() {
        return await User.findAndCountAll({ where: { role: 'ADMIN' }, order: [['id']] });
    }


    async updateUserInfo(id, name, surname, mobileNum, email) {
        let alerts = {}
        let candidate = await User.findOne({ where: { mobileNum, id: { [Op.not]: id } } });
        if (candidate) alerts.mobileNum = 'A user with this phone number is already registered';
        candidate = await User.findOne({ where: { email, id: { [Op.not]: id } } });
        if (candidate) alerts.email = 'User with this email is already registered';
        if (alerts.mobileNum || alerts.email) return alerts;

        await User.update({ name, surname, mobileNum, email }, { where: { id } });
        const user = await User.findOne({ where: { id } });
        return { token: this.generateJwt(user.id, user.name, user.surname, user.email, user.mobileNum, user.role) };
    }


    async deleteUser(id) {
        await User.destroy({ where: { id } });
        await UserEmails.destroy({ where: { userId: id } });
    }


    async blockUser(id) {
        await User.update({ isBlocked: true }, { where: { id } });
    }


    async unblockUser(id) {
        await User.update({ isBlocked: false }, { where: { id } });
    }


    async checkMobileNum(mobileNum) {
        return await User.findOne({ where: { mobileNum } });
    }
}


export default new UserService();