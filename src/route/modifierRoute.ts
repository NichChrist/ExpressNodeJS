import { Router } from 'express';
import ModifierController from '../controllers/ModifierController';
import ModifierValidator from '../validator/ModifierValidator';
import path = require("path");
import fs from 'fs';
import { auth } from '../middlewares/auth';
import { idCheck } from '../middlewares/idCheck';
import { parameterCheck } from '../middlewares/parameterCheck';

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

const modifierController = new ModifierController();
const modifierValidator = new ModifierValidator();

router.post(
    '/',
    auth(),
    modifierValidator.modifierCreateValidator,
    modifierController.createModifier
);

router.get(
    '/dropdown',
    auth(),
    modifierController.dropdownModifier
);

router.get(
    '/',
    auth(),
    parameterCheck(),
    modifierValidator.modifierGetValidator,
    modifierController.listModifier
);

router.put(
    '/:id',
    auth(),
    idCheck(),
    modifierValidator.modifierUpdateValidator,
    modifierController.updateModifier
);

router.delete(
    '/:id',
    auth(),
    idCheck(),
    modifierController.deleteModifier
);

// router.post(
//     '/upload-csv',
//     auth(),
//     upload.single('import_test'),
//     modifierValidator.csvValidator,
//     modifierController.createMultipleModifier
// );

export default router;