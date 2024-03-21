/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

export const idCheck = (param?: string) => async (req: Request, res: Response, next: NextFunction) => {
    const uuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(param ? req.params[param] : req.params.id);
    if (uuid) {
        return next()
    } else {
        return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
            code: httpStatus.UNPROCESSABLE_ENTITY,
            message: `Parameter ${param ? param : 'ID'} have to be in UUID format`,
        });
    }
}