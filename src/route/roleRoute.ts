import { Router } from 'express';
import RoleController from '../controllers/RoleController';
import RoleValidator from '../validator/RoleValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';
import { checkingPermission } from '../middlewares/checkingPermission';

const router = Router();

const roleController = new RoleController();
const roleValidator = new RoleValidator();

router.get(
    '/',
    auth(),
    checkingPermission('role', 'read'),
    parameterCheck(),
    roleController.getRolesData
);
router.get(
    '/:id',
    auth(),
    checkingPermission('role', 'read'),
    idCheck(),
    roleController.getRolesDataById
);
router.post(
    '/',
    auth(),
    checkingPermission('role', 'create'),
    roleValidator.roleCreateValidator,
    roleController.createRole
);
router.delete(
    '/:id',
    auth(),
    checkingPermission('role', 'delete'),
    idCheck(),
    roleController.deleteRole
)
router.put(
    '/:id',
    auth(),
    checkingPermission('role', 'update'),
    idCheck(),
    roleValidator.roleUpdateValidator,
    roleController.updateRole
)
router.post(
    '/reorder',
    auth(),
    checkingPermission('role', 'update'),
    roleValidator.reorderValidator,
    roleController.reorderRoles
)
export default router;
