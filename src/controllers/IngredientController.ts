import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IIngredient } from '../models/interfaces/IIngredient';
import { logger } from '../config/logger';
import IngredientService from '../service/implementations/IngredientService';
const csv = require('csv-parser');
import fs from 'fs';

export default class IngredientController {

    private ingredientService: IngredientService;

    constructor() {
        this.ingredientService = new IngredientService();
    }

    createIngredient = async (req: Request, res: Response) => {
        try {
            const data = await this.ingredientService.createIngredient(req.body)
            const { code, message } = data.response;
            const model = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: model,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    list = async (req: Request, res: Response) => {
        try {
            const users = await this.ingredientService.listIngredient(req.query);
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
            const users = await this.ingredientService.dropdown(req);
            const { message, data } = users.response;
            const code = users.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    dropdownBranch = async (req: Request, res: Response) => {
        try {
            const users = await this.ingredientService.dropdownOutletIngredient(req);
            const { message, data } = users.response;
            const code = users.statusCode;
            res.status(code).send({ code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    getIngredientDataById = async (req: Request, res: Response) => {
        try {
            const data = await this.ingredientService.getIngredientById(req.params.id)
            const { code, message } = data.response;
            const role = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: role,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    };

    getIngredientBranchDataById = async (req: Request, res: Response) => {
        try {
            const data = await this.ingredientService.getBranchIngredientById(req.params.id, req)
            const { code, message } = data.response;
            const role = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: role,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    };

    deleteIngredient = async (req: Request, res: Response) => {
        try {
            const data = await this.ingredientService.deleteIngredientById(req.params.id)
            const { code, message } = data.response;
            res.status(data.statusCode).json({
                code: code,
                message: message,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    deleteBranchIngredient = async (req: Request, res: Response) => {
        try {
            const data = await this.ingredientService.deleteBranchIngredientById(req.params.id, req)
            const { code, message } = data.response;
            res.status(data.statusCode).json({
                code: code,
                message: message,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    updateIngredient = async (req: Request, res: Response) => {
        try {
            const data = await this.ingredientService.updateIngredientById(req.params.id, req.body)
            const { code, message } = data.response;
            const role = data.response.data;
            res.status(data.statusCode).json({
                code: code,
                message: message,
                data: role,
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    };
}
