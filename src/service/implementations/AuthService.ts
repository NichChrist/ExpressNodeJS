import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';
import TokenDao from '../../dao/implementations/TokenDao';
import UserDao from '../../dao/implementations/UserDao';
import responseHandler from '../../helper/responseHandler';
import IAuthService from '../contracts/IAuthService';
import RedisService from './RedisService';
import { tokenTypes } from '../../config/tokens';
import { responseMessageConstant } from '../../config/constant';

export default class AuthService implements IAuthService {
    private userDao: UserDao;

    private tokenDao: TokenDao;

    private redisService: RedisService;

    constructor() {
        this.userDao = new UserDao();
        this.tokenDao = new TokenDao();
        this.redisService = new RedisService();
    }

    loginWithEmailPassword = async (email: string, password: string) => {
        try {
            let message = responseMessageConstant.LOGIN_200_SUCCESS;
            
            let user = await this.userDao.getByEmail(email);
            if (user == null || !user.dataValues.is_active) {
                return responseHandler.returnError(
                    httpStatus.BAD_REQUEST,
                    responseMessageConstant.LOGIN_400_INCORRECT_EMAIL_OR_PASS
                );
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.LOGIN_400_INCORRECT_EMAIL_OR_PASS);
            }

            user = user.toJSON();
            delete user.password;

            return responseHandler.returnSuccess(httpStatus.OK, message, user);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    logout = async (req: Request, res: Response) => {
        const refreshTokenDoc = await this.tokenDao.findOne({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
        if (!refreshTokenDoc) {
            res.status(httpStatus.NOT_FOUND).send({ message: responseMessageConstant.USER_404_NOT_FOUND });
        }
        await this.tokenDao.remove({
            token: req.body.refresh_token,
            type: tokenTypes.REFRESH,
            blacklisted: false,
        });
        await this.tokenDao.remove({
            token: req.body.access_token,
            type: tokenTypes.ACCESS,
            blacklisted: false,
        });
        await this.redisService.removeToken(req.body.access_token, 'access_token');
        await this.redisService.removeToken(req.body.refresh_token, 'refresh_token');
        return true;
    };
}
