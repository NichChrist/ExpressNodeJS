import { Router } from 'express';
import ModelController from '../controllers/ModelController';
import ModelValidator from '../validator/ModelValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

const router = Router();

const modelController = new ModelController();
const modelValidator = new ModelValidator();

// auth()

router.get(
    '/',
    parameterCheck(),
    modelController.getModelsData
);
router.get(
    '/:id',
    idCheck(),
    modelController.getModelsDataById
);
router.post(
    '/',
    modelValidator.modelCreateValidator,
    modelController.createModel
);
router.delete(
    '/:id',
    idCheck(),
    modelController.deleteModel
);
router.put(
    '/:id',
    idCheck(),
    modelValidator.modelUpdateValidator,
    modelController.updateModel
)

export default router;
