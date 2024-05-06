import { Router } from 'express';
import UomController from '../controllers/UomController';
import UomValidator from '../validator/UomValidator';
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

const uomController = new UomController();
const uomValidator = new UomValidator();

router.get(
    '/',
    auth(),
    parameterCheck(),
    uomController.listUom
);
router.get(
    '/dropdown',
    auth(),
    uomController.dropdownUom       
);
router.get(
    '/export-csv',
    auth(),
    uomController.exportToCsv
);
router.post(
    '/',
    auth(),
    uomValidator.uomCreateValidator,
    uomController.createUom
);
router.post(
    '/upload-csv',
    auth(),
    upload.single('import_test'),
    uomValidator.csvValidator,
    uomController.createBulkUom
);
router.put(
    '/:id',
    auth(),
    idCheck(),
    uomValidator.uomUpdateValidator,
    uomController.updateUom
);
router.delete(
    '/:id',
    auth(),
    idCheck(),
    uomController.deleteUom
);
export default router;