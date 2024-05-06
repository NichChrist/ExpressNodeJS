import { Router } from 'express';
import IngredientController from '../controllers/IngredientController';
import IngredientValidator from '../validator/IngredientValidator';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

const router = Router();

const ingredientController = new IngredientController();
const ingredientValidator = new IngredientValidator();

router.get(
    '/branch/:id',
    auth(),
    idCheck(),
    ingredientController.getIngredientBranchDataById
);

router.get(
    '/',
    auth(),
    parameterCheck(),
    ingredientController.list
);

router.get(
    '/dropdown',
    auth(),
    parameterCheck(),
    ingredientController.dropdown
);

router.get(
    '/dropdown-branch',
    auth(),
    ingredientController.dropdownBranch
);

router.get(
    '/:id',
    auth(),
    idCheck(),
    ingredientController.getIngredientDataById
);

router.post(
    '/',
    auth(),
    ingredientValidator.ingredientCreateValidator,
    ingredientController.createIngredient
);

router.delete(
    '/:id',
    auth(),
    idCheck(),
    ingredientController.deleteIngredient
);

router.delete(
    '/branch/:id',
    auth(),
    idCheck(),
    ingredientController.deleteBranchIngredient
);

router.put(
    '/:id',
    auth(),
    idCheck(),
    ingredientValidator.ingredientUpdateValidator,
    ingredientController.updateIngredient
);

router.put(
    '/branch/:id',
    auth(),
    idCheck(),
    ingredientValidator.branchIngredientUpdateValidator,
    ingredientController.updateIngredient
);

export default router;
