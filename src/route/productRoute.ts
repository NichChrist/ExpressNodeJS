import { Router } from "express";
import { idCheck } from "../middlewares/idCheck";
import { parameterCheck } from "../middlewares/parameterCheck";
import ProductController from "../controllers/ProductController";
import ProductValidator from "../validator/ProductValidator";

const router = Router();

const productController = new ProductController();
const productValidator = new ProductValidator();

router.get(
    '/',
    parameterCheck(),
    productController.getProduct
);

router.get(
    '/:id',
    idCheck(),
    productController.getProductById
)

router.post(
    '/',
    productValidator.productCreateValidator,
    productController.createProduct
)

router.put(
    '/:id',
    idCheck(),
    productValidator.productUpdateValidator,
    productController.updateProduct
)

router.delete(
    '/:id',
    idCheck(),
    productController.deleteProduct
)

export default router;