import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import { auth } from '../middlewares/auth';
import UserValidator from '../validator/UserValidator';

const router = Router();

const authController = new AuthController();
const userValidator = new UserValidator();

router.post('/register-owner', userValidator.ownerCreateValidator, authController.registerOwner);
router.post('/register-user', auth(), userValidator.userCreateValidator, authController.register);
router.post('/username-exists', userValidator.checkUsernameValidator, authController.checkUsername);
router.post('/login', userValidator.userLoginValidator, authController.login);
router.post('/refresh-token', authController.refreshTokens);
router.post('/logout', authController.logout);
// router.put(
//     '/change-password',
//     auth(),
//     userValidator.changePasswordValidator,
//     authController.changePassword
// );

export default router;
