import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import ProductValidator from '../validator/ProductValidator';
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

const productController = new ProductController();
const productValidator = new ProductValidator();


router.get(
    '/',
    auth(),
    parameterCheck(),
    productValidator.productGetValidator,
    productController.getProduct
);
router.get(
    '/:id',
    auth(),
    parameterCheck(),
    productController.getProductById
);
router.get(
    '/export-csv',
    auth(),
    productController.exportToCsv
);
router.get(
    '/outlet/:id',
    auth(),
    parameterCheck(),
    productController.getProductById
);
router.post(
    '/',
    auth(),
    productValidator.productCreateValidator,
    productController.createProduct
);
router.post(
    '/upload-csv',
    auth(),
    upload.single('import_test'),
    productValidator.csvValidator,
    productController.createMultipleProduct
);
router.delete(
    '/:id',
    idCheck(),
    productController.deleteProduct
);
router.put(
    '/:id',
    idCheck(),
    productValidator.productUpdateValidator,
    productController.updateProduct
)

export default router;
