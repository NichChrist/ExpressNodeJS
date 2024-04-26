import { Router } from 'express';
import ModelController from '../controllers/ModelController';
import ModelValidator from '../validator/ModelValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

const router = Router();

const modelController = new ModelController();
const modelValidator = new ModelValidator();

router.get(
    '/',
    auth(),
    parameterCheck(),
    modelController.getModelsData
);
router.get(
    '/:id',
    auth(),
    idCheck(),
    modelController.getModelsDataById
);
router.post(
    '/',
    auth(),
    modelValidator.modelCreateValidator,
    modelController.createModel
);
router.delete(
    '/:id',
    auth(),
    idCheck(),
    modelController.deleteModel
);
router.put(
    '/:id',
    auth(),
    idCheck(),
    modelValidator.modelUpdateValidator,
    modelController.updateModel
)

export default router;
