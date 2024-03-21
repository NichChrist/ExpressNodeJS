import { Router } from 'express';
import ModuleController from '../controllers/ModuleController';
import ModuleValidator from '../validator/ModuleValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

const router = Router();

const moduleController = new ModuleController();
const moduleValidator = new ModuleValidator();

router.get(
    '/',
    auth(),
    parameterCheck(),
    moduleController.getModulesData
);
router.get(
    '/:id',
    auth(),
    idCheck(),
    moduleController.getModulesDataById
);
router.post(
    '/',
    auth(),
    moduleValidator.moduleCreateValidator,
    moduleController.createModule
);
router.delete(
    '/:id',
    auth(),
    idCheck(),
    moduleController.deleteModule
);
router.put(
    '/:id',
    auth(),
    idCheck(),
    moduleValidator.moduleUpdateValidator,
    moduleController.updateModule
)

export default router;
