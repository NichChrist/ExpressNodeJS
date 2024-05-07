import { Router } from 'express';
import UomConversionController from '../controllers/UomConversionController';
import UomConversionValidator from '../validator/UomConversionValidator';
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

const uomConversionController = new UomConversionController();
const uomConversionValidator = new UomConversionValidator();

router.post(
    '/',
    auth(),
    uomConversionValidator.uomConversionCreateValidator,
    uomConversionController.createUomConversion
);

router.post(
    '/upload-csv',
    auth(),
    upload.single('import_test'),
    uomConversionValidator.csvValidator,
    uomConversionController.createBulkUomConversion
);

router.get(
    '/',
    auth(),
    parameterCheck(),
    uomConversionValidator.uomConversionGetValidator,
    uomConversionController.listUomConversion
)

router.get(
    '/export-csv',
    auth(),
    uomConversionController.exportToCsv
);

router.put(
    '/',
    auth(),
    uomConversionValidator.uomConversionUpdateValidator,
    uomConversionController.updateUomConversion
)

router.delete(
    '/:id',
    auth(),
    idCheck(),
    uomConversionController.deleteUomConversion
)
export default router;