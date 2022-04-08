import Router from 'express';
const router = new Router();
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRoleMiddleware from '../middlewares/checkRoleMiddleware.js';
import UserController from '../controllers/UserController.js';

router.get('/auth', authMiddleware, UserController.checkAuth);

router.post('/registration', UserController.reqistration);
router.get('/activate/:link', UserController.activateUser);

router.post('/login', UserController.login);

router.post('/createChangePasswordLink', UserController.createChangePasswordLink);
router.get('/checkChangePasswordLink/:link', UserController.checkChangePasswordLink);
router.put('/changePassword', UserController.changePassword);

router.get('/users', authMiddleware, checkRoleMiddleware, UserController.getUsers);
router.get('/admins', authMiddleware, checkRoleMiddleware, UserController.getAdmins);

router.put('/', authMiddleware, UserController.updateUserInfo);
router.delete('/', authMiddleware, checkRoleMiddleware, UserController.deleteUser);

router.put('/block', authMiddleware, checkRoleMiddleware, UserController.blockUser);
router.put('/unblock', authMiddleware, checkRoleMiddleware, UserController.unblockUser);

router.get('/checkMobileNum', UserController.checkMobileNum);

export default router;