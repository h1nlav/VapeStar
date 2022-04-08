import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError.js';
import UserService from '../services/UserService.js';

class UserController {
    async checkAuth(req, res, next) {
        try {
            await UserService.checkAuth(req.user.id)
                .then(authRes => {
                    if (authRes.token) return res.status(201).json(authRes);
                    else return next(ApiError.unauthorized('User not authorized'));
                })
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async reqistration(req, res, next) {
        try {
            let { name, surname, mobileNum, email, password, role = 'USER' } = req.body;

            if (!name || !surname || !mobileNum || !email || !password) return next(ApiError.badRequest('Fill in all the fields'));
            if (role === 'ADMIN') {
                try {
                    const token = req.headers.authorization.split(' ')[1];
                    const decoded = jwt.verify(token, process.env.JWT_KEY);
                    if (decoded.role !== 'ROOT') return next(ApiError.forbiden('No access rights'));
                } catch (err) { return next(ApiError.forbiden('No access rights')) };
            }

            res.status(201).json(await UserService.reqistration(name, surname, mobileNum, email, password, role));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async activateUser(req, res, next) {
        try {
            const { link } = req.params;
            if (!link) return next(ApiError.badRequest('Invalid link'));
            res.status(200).json(await UserService.activateUser(link));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async login(req, res, next) {
        try {
            const { login, password } = req.body;
            if (!login || !password) return next(ApiError.badRequest('Fill in all the fields'));
            res.status(200).json(await UserService.login(login, password));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async createChangePasswordLink(req, res, next) {
        try {
            const { login } = req.body;
            if (!login) return next(ApiError.badRequest('Login not specified'));
            res.status(200).json(await UserService.createChangePasswordLink(login));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async checkChangePasswordLink(req, res, next) {
        try {
            const { link } = req.params;
            if (!link) return next(ApiError.badRequest('Invalid link'));
            res.status(200).json(await UserService.checkChangePasswordLink(link));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async changePassword(req, res, next) {
        try {
            const { link, password } = req.body;
            if (!link || !password) return next(ApiError.badRequest('Fill in all the fields'));
            res.status(200).json(await UserService.changePassword(link, password));
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getUsers(req, res, next) {
        try {
            res.json(await UserService.getUsers());
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async getAdmins(req, res, next) {
        try {
            return res.json(await UserService.getAdmins());
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async updateUserInfo(req, res, next) {
        try {
            const { id, name, surname, mobileNum, email } = req.body;
            if (!id) return next(ApiError.badRequest('User id not specified'));
            if (!name || !surname || !mobileNum || !email) return next(ApiError.badRequest('Fill in all the fields'));
            return res.json(await UserService.updateUserInfo(id, name, surname, mobileNum, email));

        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.query;
            if (!id) return next(ApiError.badRequest('User id not specified'));
            await UserService.deleteUser(id);
            return res.json('User deleted');
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }

    async blockUser(req, res, next) {
        const { id } = req.body;
        if (!id) return next(ApiError.badRequest('User id not specified'));
        await UserService.blockUser(id);
        res.status(200).json({ message: 'User blocked' })
    }

    async unblockUser(req, res, next) {
        const { id } = req.body;
        if (!id) return next(ApiError.badRequest('User id not specified'));
        await UserService.unblockUser(id);
        res.status(200).json({ message: 'User unblocked' })
    }

    async checkMobileNum(req, res, next) {
        const { mobileNum } = req.query;
        if (!mobileNum) return next(ApiError.badRequest('Phone number is not specified'));
        res.status(200).json(await UserService.checkMobileNum(mobileNum));
    }
}

export default new UserController();

