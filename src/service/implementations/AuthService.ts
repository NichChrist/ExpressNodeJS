import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { logger } from '../../config/logger';
import { IOwner } from '../../models/interfaces/IOwner';
import { IOutlet } from '../../models/interfaces/IOutlet';
import TokenDao from '../../dao/implementations/TokenDao';
import UserDao from '../../dao/implementations/UserDao';
import OutletDao from '../../dao/implementations/OutletDao';
import responseHandler from '../../helper/responseHandler';
import IAuthService from '../contracts/IAuthService';
import RedisService from './RedisService';
import { tokenTypes } from '../../config/tokens';
import { responseMessageConstant } from '../../config/constant';
import db, { sequelize } from '../../models';

const { user: User, outlet: Outlet } = db;

export default class AuthService implements IAuthService {
    private userDao: UserDao;

    private tokenDao: TokenDao;

    private redisService: RedisService;

    private outletDao: OutletDao;

    constructor() {
        this.userDao = new UserDao();
        this.tokenDao = new TokenDao();
        this.redisService = new RedisService();
        this.outletDao = new OutletDao();
        
    }

    loginWithUsernamePassword = async (username: string, password: string) => {
        try {
            let message = responseMessageConstant.LOGIN_200_SUCCESS;
            
            let user = await this.userDao.getByUsername(username);
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

    registerOwner = async (ownerBody: IOwner) => {
        return sequelize.transaction(async (t) =>{
            try {
                let ownerData: any

                ownerBody.username = ownerBody.username.toLowerCase();
                ownerBody.password = bcrypt.hashSync(ownerBody.password!, 8);
                ownerBody.is_active = true;

                if (await this.userDao.isUsernameExists(ownerBody.username)) {
                    return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.EMAIL_400_TAKEN);
                }

                if (await this.outletDao.isOutletNameExists(ownerBody.outlet_name)) {
                    return responseHandler.returnError(httpStatus.BAD_REQUEST, "Outlet Name Taken");
                }
                
                if (await this.outletDao.isOutletCodeExists(ownerBody.code)) {
                    return responseHandler.returnError(httpStatus.BAD_REQUEST, "Outlet Code Taken");
                }

                const outletBody:IOutlet = {
                    business_type_id: ownerBody.business_type_id,
                    name: ownerBody.outlet_name,
                    code: ownerBody.code,
                    description: ownerBody.description,
                    address: ownerBody.address,
                    subdistrict_id: ownerBody.subdistrict_id,
                    postal_code: ownerBody.postal_code,
                    phone: ownerBody.phone,

                }

                const dataOutlet =  await Outlet.create(
                    outletBody,
                    {
                        transaction: t
                    });

                const userBody = {
                    username: ownerBody.username,
                    password: ownerBody.password,
                    name: ownerBody.name,
                    email: ownerBody.email,
                    phone_number: ownerBody.phone_number,
                    outlet_id: dataOutlet.id,
                    is_active: ownerBody.is_active,
                }

                ownerData = await User.create(
                    userBody,
                    {
                        transaction: t
                    });

                if (!ownerData) {
                    return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
                }

                ownerData = ownerData.toJSON();
                delete ownerData.password;

                return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.USER_201_REGISTERED, ownerData);
            } catch (e) {
                logger.error(e);
                await t.rollback();
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
        })
    };
}
