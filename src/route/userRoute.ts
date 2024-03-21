import { Router } from 'express';
import UserController from '../controllers/UserController';
import { auth } from '../middlewares/auth';
import UserValidator from '../validator/UserValidator';
import path = require("path");
import fs from 'fs';

const router = Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `public/${process.env.PUBLIC_FILE_FOLDER_PATH}`
        fs.mkdirSync(path, { recursive: true })
        return cb(null, path)
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.split('.');
        cb(null, filename[0] + '_' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        if (file.mimetype.split('/')[1] !== 'csv') {
            return cb(new Error('Must CSV File Format'))
        }
        cb(undefined, true)
    }
});

const userController = new UserController();
const userValidator = new UserValidator();

router.get('/', auth(), userController.list);
router.get('/dropdown', auth(), userController.dropdown);
router.get('/:id', auth(), userValidator.userGetByIdValidator, userController.getById);
router.post('/', auth(), userValidator.userCreateValidator, userController.create);
router.put('/:id', auth(), userValidator.userUpdateValidator, userController.updateById);
router.delete('/:id', auth(), userValidator.userGetByIdValidator, userController.deleteById);
router.post('/create-users', auth(), userValidator.userBulkCreateValidator, userController.createMultipleUser);
router.post('/upload-users', auth(), upload.single('user_csv'), userValidator.userBulkCreateCsvValidator, userController.createMultipleUser);

export default router;
