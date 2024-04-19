import { Router } from 'express';
import ProductCategoryController from '../controllers/ProductCategoryController';
import ProductCategoryValidator from '../validator/ProductCategoryValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

const router = Router();
const multer = require('multer');
const upload = multer({ memoryStorage: true });

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
    auth(),
    productCategoryValidator.productCategoryCreateValidator,
    productCategoryController.createProductCategory
);
router.post(
    '/import-csv',
    upload.single('xlsx_file')
    // productCategoryValidator.productCategoryUpdateValidator,
    // productCategoryController.updateProductCategory change this
)
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
