import { Router } from 'express';
import ProvinceController from '../controllers/ProvinceController';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';

const router = Router();

const provinceController = new ProvinceController();

router.get(
    '/',  
    auth(),
    provinceController.list
);

router.get(
    '/dropdown', 
    auth(),
    provinceController.dropdown
);

router.get(
    '/:id', 
    auth(), 
    idCheck(), 
    provinceController.getById
);

export default router;
