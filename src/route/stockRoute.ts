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
    stockController.list
);

router.get(
    '/export-csv',
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
    idCheck(),
    stockValidator.StockUpdateValidator,
    stockController.updateProduct
);

router.delete(
    '/:id',
    idCheck(),
    stockController.deleteStock
)

export default router;
