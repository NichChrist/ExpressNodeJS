import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { IModifier } from '../models/interfaces/IModifier';
import { logger } from '../config/logger';
import ModifierService from '../service/implementations/ModifierService';
const csv = require('csv-parser');
import fs from 'fs';

export default class ModifierController {

    private modifierService: ModifierService;

    constructor() {
        this.modifierService = new ModifierService();
    }

    createModifier = async (req: Request, res: Response) => {
        try {
            const data = await this.modifierService.createModifier(req.body, req);
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

    listModifier = async (req: Request, res: Response) => {
        try {
            const model = await this.modifierService.listModifier(req.query.name, req.query.filter, req);
            const { code, message } = model.response;
            const data: any = model.response.data;
            
            res.status(model.statusCode).json({
                code: code,
                message: message,
                count: data.count,
                data: data.rows,
            });

        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                status: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    };

    dropdownModifier = async (req: Request, res: Response) => {
        try {
            const modifiers = await this.modifierService.dropdownModifier(req);
            const { message, data } = modifiers.response;
            const code = modifiers.statusCode;
            res.status(code).send({ 
                code, 
                message, 
                data 
            });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    updateModifier = async (req: Request, res: Response) => {
        try {
            const data = await this.modifierService.updateModifierById(req.params.id, req.body);
            const { code, message } = data.response;
            res.status(data.statusCode).json({
                code: code,
                message: message,
            })
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    deleteModifier = async (req: Request, res: Response) => {
        try {
            const data = await this.modifierService.deleteModifierById(req.params.id);
            const { code, message } = data.response;
            res.status(data.statusCode).json({
                code: code,
                message: message,
            })
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).json({
                error: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong'
            })
        }
    }

    // createMultipleModifier = async (req: Request, res: Response) => {
    //     try {
    //         let modifierBody: IModifier[] = [];
    //         if (req.file) {
    //             const csvFilePath = req.file.path;
    //             await new Promise<void>((resolve, reject) => {
    //                 fs.createReadStream(csvFilePath, { encoding: 'utf8' })
    //                     .pipe(csv())
    //                     .on('data', (data: IModifier) => {
    //                         modifierBody.push(data);
    //                     })
    //                     .on('end', () => {
    //                         fs.unlinkSync(csvFilePath);
    //                         resolve();
    //                     })
    //                     .on('error', (error) => {
    //                         reject(error);
    //                     });
    //             });
    //         } else {
    //             modifierBody = req.body;
    //             if (!Array.isArray(req.body)) modifierBody = [req.body];
    //         }
    //         const user = await this.modifierService.createModifierFromCsv(modifierBody, req);
    //         const { code, message, data } = user.response;
    //         res.status(user.statusCode).json({
    //             code: code,
    //             message: message,
    //             data: data,
    //         });
    //     } catch (e) {
    //         logger.error(e);
    //         res.status(httpStatus.BAD_GATEWAY).send(e);
    //     }
    // };

}
