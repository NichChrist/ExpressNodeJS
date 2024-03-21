import { Router } from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import moduleRoute from './moduleRoute';
import roleRoute from './roleRoute';
import productRoute from './productRoute';

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
        path: '/modules',
        route: moduleRoute,
    },
    {
        path: '/products',
        route: productRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
