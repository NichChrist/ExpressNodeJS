import { Router } from 'express';
import BusinessTypeController from '../controllers/BusinessTypeController';
import BusinessTypeValidator from '../validator/BusinessTypeValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

const router = Router();

const businessTypeController = new BusinessTypeController();
const businessTypeValidator = new BusinessTypeValidator();

// auth()

router.get(
    '/',
    parameterCheck(),
    businessTypeController.getBusinessTypesData
);
router.get(
    '/:id',
    idCheck(),
    businessTypeController.getBusinessTypesDataById
);
router.post(
    '/',
    businessTypeValidator.businessTypeCreateValidator,
    businessTypeController.createBusinessType
);
router.delete(
    '/:id',
    idCheck(),
    businessTypeController.deleteBusinessType
);
router.put(
    '/:id',
    idCheck(),
    businessTypeValidator.businessTypeUpdateValidator,
    businessTypeController.updateBusinessType
)

export default router;
