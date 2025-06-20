import { Router } from 'express';
import ProductCategoryController from '../controllers/ProductCategoryController';
import ProductCategoryValidator from '../validator/ProductCategoryValidator';
import path = require("path");
import fs from 'fs';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

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

router.get(
    '/',
    auth(),
    parameterCheck(),
    productCategoryController.getProductCategories
);
router.get(
    '/export-csv',
    auth(),
    productCategoryController.exportToCsv
);
router.get(
    '/:id',
    auth(),
    parameterCheck(),
    productCategoryController.getProductCategoriesById
);
router.get(
    '/outlet/:id',
    auth(),
    parameterCheck(),
    productCategoryController.getProductCategoriesByBranch
);
router.post(
    '/',
    auth(),
    productCategoryValidator.productCategoryCreateValidator,
    productCategoryController.createProductCategory
);
router.post(
    '/upload-csv',
    auth(),
    upload.single('import_test'),
    productCategoryValidator.csvValidator,
    productCategoryController.createMultipleProductCategory
);
router.delete(
    '/:id',
    auth(),
    idCheck(),
    productCategoryController.deleteProductCategory
);
router.put(
    '/:id',
    auth(),
    idCheck(),
    productCategoryValidator.productCategoryUpdateValidator,
    productCategoryController.updateProductCategory
)

export default router;
