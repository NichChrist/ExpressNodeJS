import { Router } from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import modelRoute from './modelRoute';
import roleRoute from './roleRoute';

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
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
