import { Router } from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import modelRoute from './modelRoute';
import roleRoute from './roleRoute';
import businessTypeRoute from './businessTypeRoute';
import outletRoute from './OutletRoute'
import provinceRoute from './provinceRoute'
import cityRoute from './cityRoute'
import districtRoute from './districtRoute'
import subdistrictRoute from './subdistrictRoute'
import productCategoryRoute from './productCategoryRoute';

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
        path: '/business-type',
        route: businessTypeRoute,
    },
    {
        path: '/outlet',
        route: outletRoute,
    },
    {
        path: '/province',
        route: provinceRoute,
    },
    {
        path: '/city',
        route: cityRoute,
    },
    {
        path: '/district',
        route: districtRoute,
    },
    {
        path: '/subdistrict',
        route: subdistrictRoute,
    },
    {
        path: '/product-category',
        route: productCategoryRoute
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
