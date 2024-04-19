import { Router } from 'express';
import ProductCategoryController from '../controllers/ProductCategoryController';
import ProductCategoryValidator from '../validator/ProductCategoryValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';
import path = require("path");
import fs from 'fs';

const router = Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `public/${process.env.PUBLIC_FILE_FOLDER_PATH}`
        fs.mkdirSync(path, { recursive: true })
        return cb(null, path)
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.split('.');
        cb(null, filename[0] + '_' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        if (file.mimetype.split('/')[1] !== 'csv') {
            return cb(new Error('Must CSV File Format'))
        }
        cb(undefined, true)
    }
});

const productCategoryController = new ProductCategoryController();
const productCategoryValidator = new ProductCategoryValidator();

//auth()

router.get(
    '/',
    parameterCheck(),
    productCategoryController.getProductCategoriesData
);
router.get(
    '/export-csv',
    productCategoryController.ExportToCSV
);
router.get(
    '/:name',
    productCategoryController.getProductCategoryDataByName
);
router.post(
    '/',
    productCategoryValidator.productCategoryCreateValidator,
    productCategoryController.createProductCategory
);
router.delete(
    '/:id',
    idCheck(),
    productCategoryController.deleteProductCategory
);
router.put(
    '/:id',
    idCheck(),
    productCategoryValidator.productCategoryUpdateValidator,
    productCategoryController.updateProductCategory
)

export default router;
