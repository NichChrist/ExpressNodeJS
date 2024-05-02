import { Router } from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import modelRoute from './modelRoute';
import roleRoute from './roleRoute';
import businessTypeRoute from './businessTypeRoute';
import outletRoute from './outletRoute'
import provinceRoute from './provinceRoute'
import cityRoute from './cityRoute'
import districtRoute from './districtRoute'
import subdistrictRoute from './subdistrictRoute'
import productCategoryRoute from './productCategoryRoute';
import productRoute from './productRoute';
import stockRoute from './stockRoute';
import ingredientRoute from './ingredientRoute'
import modifierRoute from './modifierRoute'
import uomRoute from './uomRoute'

const router = Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
    {
        path: '/roles',
        route: roleRoute,
    },
    {
        path: '/models',
        route: modelRoute,
    },
    {
        path: '/business-types',
        route: businessTypeRoute,
    },
    {
        path: '/outlets',
        route: outletRoute,
    },
    {
        path: '/provinces',
        route: provinceRoute,
    },
    {
        path: '/cities',
        route: cityRoute,
    },
    {
        path: '/districts',
        route: districtRoute,
    },
    {
        path: '/subdistricts',
        route: subdistrictRoute,
    },
    {
        path: '/product-categories',
        route: productCategoryRoute
    },
    {
        path: '/products',
        route: productRoute
    },
    {
        path: '/stocks',
        route: stockRoute
    },
    {
        path: '/ingredients',
        route: ingredientRoute
    },
    {
        path: '/modifiers',
        route: modifierRoute
    },
    {
        path: '/uoms',
        route: uomRoute
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
