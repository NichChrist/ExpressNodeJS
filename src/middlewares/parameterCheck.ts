/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

function isInteger(value) {
    return typeof value === 'string' && /^\d+$/.test(value);
}

function isValidBoolean(value) {
    return typeof value === 'string' && /^(true|false)$/i.test(value);
}

export const parameterCheck = () => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const isEmpty = Object.keys(req.query).length === 0;
    if (isEmpty) {
        next()
    } else {
        const { page, pagination, row } = req.query;

        // For pagination
        const isPageValid = isInteger(page);
        const isPaginationValid = isValidBoolean(pagination);
        const isRowValid = isInteger(row);

        // ==========================================
        // PAGINATION
        let isPaginateValid = true;
        const paginate = page || pagination || row;
        // If one or more pagination parameters is exist, then all 3 parameters (row, page, pagination) must be true
        if (paginate) {
            isPaginateValid = isRowValid && isPageValid && isPaginationValid;
        }
        // ==========================================

        if (isPaginateValid) {
            next();
        } else {
            let errorMessages = 'Incomplete parameters';
            if (!isPageValid) errorMessages = 'Page is required and must be in integer format.';
            if (!isPaginationValid) errorMessages = 'Pagination is required and must be in boolean format.';
            if (!isRowValid) errorMessages = 'Row is required and must be in integer format.';
            return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
                code: httpStatus.UNPROCESSABLE_ENTITY,
                message: errorMessages,
            });
        }
    }
};