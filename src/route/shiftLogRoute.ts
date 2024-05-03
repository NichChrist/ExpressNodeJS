import { Router } from 'express';
import ShiftLogController from '../controllers/ShiftLogController';
import ShiftLogValidator from '../validator/ShiftLogValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

const router = Router();

const shiftLogController = new ShiftLogController();
const shiftLogValidator = new ShiftLogValidator();

router.post(
    '/open',
    auth(),
    shiftLogValidator.openShiftValidator,
    shiftLogController.openShift
);
router.post(
    '/close/:id',
    auth(),
    idCheck(),
    shiftLogValidator.closeShiftValidator,
    shiftLogController.closeShift
);
router.get(
    '/',
    auth(),
    parameterCheck(),
    shiftLogController.listShiftLog
);
router.get(
    '/:id',
    auth(),
    idCheck(),
    shiftLogController.shiftLogDetails
);
export default router;
