/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-shadow */
import httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import { uuid } from 'uuidv4';
import { Request } from 'express';
import { logger } from '../../config/logger';
import UserDao from '../../dao/implementations/UserDao';
import responseHandler from '../../helper/responseHandler';
import { IUser } from '../../models/interfaces/IUser';
import IUserService from '../contracts/IUserService';
import { responseMessageConstant } from '../../config/constant';
import db, { sequelize } from '../../models';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';

const { user: User, product: Product } = db;

export default class UserService implements IUserService {
    private userDao: UserDao;

    constructor() {
        this.userDao = new UserDao();
    }

    listUsers = async (query) => {
        try {
            const { pagination, page, row } = query;
            let usersData = await this.userDao.list(['withoutPassword'], pagination, page, row);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.USER_200_FETCHED_ALL, usersData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    dropdownUsers = async () => {
        try {
            let usersData = await this.userDao.list(['dropdown'], 'false', null!, null!);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.USER_200_FETCHED_ALL, usersData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    }

    createUser = async (userBody: IUser) => {
        try {
            userBody.username = userBody.username.toLowerCase();
            userBody.password = bcrypt.hashSync(userBody.password!, 8);
            userBody.is_active = true;

            if (await this.userDao.isUsernameExists(userBody.username)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.EMAIL_400_TAKEN);
            }
            console.log(userBody);
          
            let userData = await this.userDao.create(userBody);

            if (!userData) {
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }

            userData = userData.toJSON();
            delete userData.password;

            return responseHandler.returnSuccess(httpStatus.CREATED, responseMessageConstant.USER_201_REGISTERED, userData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    createBulkUser = async (userBody: IUser[]) => {
        try {
            let message = 'Successfully Create User(s)';
            let userData;

            const processUserData = async (user) => {
                if (await this.userDao.isUsernameExists(user.username)) throw { ec: 400, status: httpStatus.BAD_REQUEST, message: 'Email already taken' };

                if (user.password === undefined) throw { ec: 400, status: httpStatus.BAD_REQUEST, message: 'Password is required' };

                const uuidValue = uuid();
                user.email = user.email.toLowerCase();
                user.password = bcrypt.hashSync(user.password, 8);
                user.uuid = uuidValue;
                user.status = responseMessageConstant.STATUS_ACTIVE;
                user.email_verified = responseMessageConstant.EMAIL_VERIFIED_TRUE;

                return user;
            };

            await sequelize.transaction(async (t) => {
                const emailMap = new Map();
                for (let i = 0; i < userBody.length; i++) {
                    const email = userBody[i].username;

                    if (emailMap.has(email)) throw { ec: 400, status: httpStatus.BAD_REQUEST, message: 'Email cannot be duplicates' };

                    emailMap.set(email, true);

                    userBody[i] = await processUserData(userBody[i]);
                }

                userData = await User.bulkCreate(userBody, { transaction: t });
                userData.forEach((user) => delete user.dataValues.password);
            });

            return responseHandler.returnSuccess(httpStatus.CREATED, message, userData);
        } catch (e: any) {
            logger.error(e);
            if (e.ec) return responseHandler.returnError(e.status, e.message);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong');
        }
    };


    isUsernameExists = async (username: string) => {
        if (!(await this.userDao.isUsernameExists(username))) {
            return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.EMAIL_404_NOT_FOUND);
        }
        return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.EMAIL_200_FOUND);
    };

    getUserById = async (id: string) => {
        try {
            let userData = await this.userDao.getById(['withoutPassword'], id)
            if (!userData) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.USER_404_NOT_FOUND);
            }
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.USER_200_FETCHED_SINGLE, userData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    deleteUserById = async (id: string) => {
        try {
            let userData = await this.userDao.getById([], id)
            if (!userData) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.USER_404_NOT_FOUND);
            }
            await this.userDao.deleteById(id);
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.USER_200_DELETED);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    updateUserById = async (userBody: IUser, id: string) => {
        try {
            let userData = await this.userDao.getById(['withoutPassword'], id)
            if (!userData) {
                return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.USER_404_NOT_FOUND);
            }
            let updatedUserData = await this.userDao.updateById(userBody, id);

            if (updatedUserData[0] !== 1) {
                return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }

            userData = await this.userDao.getById(['withoutPassword'], id)
            return responseHandler.returnSuccess(httpStatus.OK, responseMessageConstant.USER_200_UPDATED, userData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_GATEWAY, responseMessageConstant.HTTP_502_BAD_GATEWAY);
        }
    };

    // changePassword = async (req: Request) => {
    //     try {
    //         const { password, old_password } = req.body;
    //         if (req.userInfo === undefined) {
    //             return responseHandler.returnError(httpStatus.UNAUTHORIZED, responseMessageConstant.HTTP_401_UNAUTHORIZED);
    //         }
    //         let user = await this.userDao.findOneByWhere({ id: req.userInfo.id });

    //         if (!user) {
    //             return responseHandler.returnError(httpStatus.NOT_FOUND, responseMessageConstant.USER_404_NOT_FOUND);
    //         }

    //         const isPasswordValid = await bcrypt.compare(old_password, user.password);
    //         user = user.toJSON();
    //         delete user.password;
    //         if (!isPasswordValid) {
    //             return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.OLD_PASSWORD_400_INCORRECT);
    //         }
    //         const updateUser = await this.userDao.updateWhere(
    //             { password: bcrypt.hashSync(password, 8) },
    //             { id: user.id }
    //         );

    //         if (updateUser) {
    //             return responseHandler.returnSuccess(
    //                 httpStatus.OK,
    //                 responseMessageConstant.PASSWORD_200_UPDATE_SUCCESS,
    //             );
    //         }

    //         return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.PASSWORD_400_UPDATE_FAILED);
    //     } catch (e) {
    //         console.log(e);
    //         return responseHandler.returnError(httpStatus.BAD_REQUEST, responseMessageConstant.PASSWORD_400_UPDATE_FAILED);
    //     }
    // };
}
