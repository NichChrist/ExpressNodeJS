import { Router } from 'express';
import SubdistrictController from '../controllers/SubdistrictController';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';

const router = Router();

const subdistrictController = new SubdistrictController();
// auth()

router.get(
    '/',  
    subdistrictController.list
);

router.get(
    '/dropdown', 
    subdistrictController.dropdown
);

router.get(
    '/:id', 
    auth(), 
    idCheck(), 
    subdistrictController.getById
);

export default router;