import { IUser } from '../../models/interfaces/IUser';

declare global {
    namespace Express {
        interface Request {
            userInfo?: IUser;
            file?: {
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                size: number;
                destination: string;
                filename: string;
                path: string;
                buffer: Buffer;
            };
        }
    }
}
