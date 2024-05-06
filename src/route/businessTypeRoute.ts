import { Router } from 'express';
import BusinessTypeController from '../controllers/BusinessTypeController';
import BusinessTypeValidator from '../validator/BusinessTypeValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

const router = Router();

const businessTypeController = new BusinessTypeController();
const businessTypeValidator = new BusinessTypeValidator();

router.get(
    '/',
    auth(),
    parameterCheck(),
    businessTypeController.getBusinessTypesData
);
router.get(
    '/:id',
    auth(),
    idCheck(),
    businessTypeController.getBusinessTypesDataById
);
router.post(
    '/',
    auth(),
    businessTypeValidator.businessTypeCreateValidator,
    businessTypeController.createBusinessType
);
router.delete(
    '/:id',
    auth(),
    idCheck(),
    businessTypeController.deleteBusinessType
);
router.put(
    '/:id',
    auth(),
    idCheck(),
    businessTypeValidator.businessTypeUpdateValidator,
    businessTypeController.updateBusinessType
)

export default router;
