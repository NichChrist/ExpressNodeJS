import { Request, Response } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IOwner } from '../../models/interfaces/IOwner';

export default interface IAuthService {
    loginWithUsernamePassword: (username: string, password: string) => Promise<ApiServiceResponse>;
    logout: (req: Request, res: Response) => Promise<boolean>;
    registerOwner: (ownerBody: IOwner) => Promise<ApiServiceResponse>;
}
