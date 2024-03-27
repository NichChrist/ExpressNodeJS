import { Router } from 'express';
import ProvinceController from '../controllers/ProvinceController';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import path = require("path");

const router = Router();

const provinceController = new ProvinceController();
// auth()

router.get(
    '/',  
    provinceController.list
);

router.get(
    '/dropdown', 
    provinceController.dropdown
);

router.get(
    '/:id', 
    auth(), 
    idCheck(), 
    provinceController.getById
);

export default router;
