import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ApiServiceResponse } from '../@types/apiServiceResponse';
import { logger } from '../config/logger';
import { tokenTypes } from '../config/tokens';
import { IUser } from '../models/interfaces/IUser';
import AuthService from '../service/implementations/AuthService';
import TokenService from '../service/implementations/TokenService';
import UserService from '../service/implementations/UserService';
import { responseMessageConstant } from '../config/constant';
import UserDao from '../dao/implementations/UserDao';
import fs from 'fs';
const csv = require('csv-parser');

export default class UserController {
    private userService: UserService;

    private tokenService: TokenService;

    private authService: AuthService;

    private userDao: UserDao;

    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authService = new AuthService();
        this.userDao = new UserDao();
    }

    list = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.listUsers(req.query);
            const { message, data } = users.response;
            const code = users.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    dropdown = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.dropdownUsers();
            const { message, data } = users.response;
            const code = users.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.getUserById(req.params.id);
            const { message, data } = user.response;
            const code = user.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    deleteById = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.deleteUserById(req.params.id);
            const { message, data } = user.response;
            const code = user.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    updateById = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.updateUserById(req.body, req.params.id);
            const { message, data } = user.response;
            const code = user.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.createUser(req.body, req);
            const { message, data } = user.response;
            const code = user.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    checkUsername = async (req: Request, res: Response) => {
        try {
            const isExists = await this.userService.isUsernameExists(req.body.username.toLowerCase());
            res.status(isExists.statusCode).send(isExists.response);
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;
            const user = await this.authService.loginWithUsernamePassword(  
                username.toLowerCase(),
                password
            );
            const { message, data } = user.response;
            const code = user.statusCode;
            if (code === 200) {
                let tokens = {};
                tokens = await this.tokenService.generateAuthTokens(<IUser>data);
                res.status(user.statusCode).send({ code, message, data, tokens });
            } else {
                res.status(user.statusCode).send({ code, message, data });
            }
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    logout = async (req: Request, res: Response) => {
        await this.authService.logout(req, res);
        res.status(httpStatus.NO_CONTENT).send();
    };

    refreshTokens = async (req: Request, res: Response) => {
        try {
            const refreshTokenDoc = await this.tokenService.verifyToken(
                req.body.refresh_token,
                tokenTypes.REFRESH
            );
            const user = await this.userDao.findById(refreshTokenDoc.user_id);
            if (user == null) {
                res.status(httpStatus.NOT_FOUND).send(responseMessageConstant.USER_404_NOT_FOUND);
            }
            if (refreshTokenDoc.id === undefined) {
                return res.status(httpStatus.BAD_GATEWAY).send(responseMessageConstant.HTTP_502_BAD_GATEWAY);
            }
            await this.tokenService.removeTokenById(refreshTokenDoc.id);
            const tokens = await this.tokenService.generateAuthTokens(user);
            res.send(tokens);
        } catch (e) {
            logger.error(e);
            return res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    createMultipleUser = async (req: Request, res: Response) => {
        try {
            let userBody: IUser[] = [];
            if (req.file) {
                const csvFilePath = req.file.path;
                await new Promise<void>((resolve, reject) => {
                    fs.createReadStream(csvFilePath, { encoding: 'utf8' })
                        .pipe(csv())
                        .on('data', (data: IUser) => {
                            if (data.password) userBody.push(data);
                        })
                        .on('end', () => {
                            fs.unlinkSync(csvFilePath);
                            resolve();
                        })
                        .on('error', (error) => {
                            reject(error);
                        });
                });
            } else {
                userBody = req.body;
                if (!Array.isArray(req.body)) userBody = [req.body];
            }

            const user = await this.userService.createBulkUser(userBody);
            const { code, message, data } = user.response;
            res.status(user.statusCode).json({
                code: code,
                message: message,
                data: data,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                code: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    };
}
