import { Router } from 'express';
import SubdistrictController from '../controllers/SubdistrictController';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';

const router = Router();

const subdistrictController = new SubdistrictController();

router.get(
    '/',  
    auth(),
    subdistrictController.list
);

router.get(
    '/dropdown', 
    auth(),
    subdistrictController.dropdown
);

router.get(
    '/:id', 
    auth(), 
    idCheck(), 
    subdistrictController.getById
);

export default router;