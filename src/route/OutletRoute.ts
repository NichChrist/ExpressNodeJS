import { Router } from 'express';
import OutletController from '../controllers/OutletController';
import OutletValidator from '../validator/OutletValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

const router = Router();

const outletController = new OutletController();
const outletValidator = new OutletValidator();


router.get(
    '/list',
    auth(),
    parameterCheck(),
    outletController.listOutlets
);

router.get(
    '/branches',
    auth(),
    outletController.getBranchDataByName
)

router.get(
    '/dropdown', 
    auth(),
    outletController.dropdown
);

router.get(
    '/dropdown-branch',
    auth(), 
    outletController.dropdownBranch
);

router.get(
    '/:id',
    auth(),
    idCheck(),
    outletController.getOutletsDataById
);
router.post(
    '/',
    auth(),
    outletValidator.OutletCreateValidator,
    outletController.createOutlet
);
router.delete(
    '/:id',
    auth(),
    idCheck(),
    outletController.deleteOutlet
);
router.delete(
    '/branches/:id',
    auth(),
    idCheck(),
    outletController.deleteBranch
);
router.put(
    '/:id',
    auth(),
    idCheck(),
    outletValidator.outletUpdateValidator,
    outletController.updateOutlet
);
router.put(
    '/branches/:id',
    auth(),
    idCheck(),
    outletValidator.branchUpdateValidator,
    outletController.updateBranch
)

export default router;
