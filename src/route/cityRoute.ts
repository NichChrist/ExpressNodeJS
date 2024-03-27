import { Router } from 'express';
import CityController from '../controllers/CityController';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';

const router = Router();

const cityController = new CityController();
// auth()

router.get(
    '/',  
    cityController.list
);

router.get(
    '/dropdown', 
    cityController.dropdown
);

router.get(
    '/:id', 
    auth(), 
    idCheck(), 
    cityController.getById
);

export default router;
