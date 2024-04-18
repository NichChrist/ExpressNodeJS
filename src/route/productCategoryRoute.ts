import { Router } from 'express';
import ProductCategoryController from '../controllers/ProductCategoryController';
import ProductCategoryValidator from '../validator/ProductCategoryValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

const router = Router();

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
