import { Router } from 'express';
import StockController from '../controllers/StockController';
import StockValidator from '../validator/StockValidator';
import path = require("path");
import fs from 'fs';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

const router = Router();
const multer = require('multer');

const stockController = new StockController();
const stockValidator = new StockValidator();

router.get(
    '/',
    auth(),
    stockController.list
);

router.get(
    '/export-csv',
    auth(),
    stockController.exportToCsv
);

router.get(
    '/:id',
    auth(),
    parameterCheck(),
    stockController.getById
);

router.put(
    '/:id',
    auth(),
    idCheck(),
    stockValidator.StockUpdateValidator,
    stockController.updateProduct
);

router.delete(
    '/:id',
    auth(),
    idCheck(),
    stockController.deleteStock
)

export default router;
