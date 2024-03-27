import { Router } from 'express';
import DistrictController from '../controllers/DistrictController';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';

const router = Router();

const districtController = new DistrictController();
// auth()

router.get(
    '/',  
    districtController.list
);

router.get(
    '/dropdown', 
    districtController.dropdown
);

router.get(
    '/:id', 
    auth(), 
    idCheck(), 
    districtController.getById
);

export default router;