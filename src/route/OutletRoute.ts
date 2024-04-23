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
    '/',
    auth(),
    parameterCheck(),
    outletController.listOutlets
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
    idCheck(),
    outletController.deleteOutlet
);
router.put(
    '/:id',
    auth(),
    idCheck(),
    outletValidator.outletUpdateValidator,
    outletController.updateOutlet
)

export default router;
