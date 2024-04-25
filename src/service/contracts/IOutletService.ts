import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IOutlet } from '../../models/interfaces/IOutlet';

export default interface IOutletService {
    listOutlet: (query) => Promise<ApiServiceResponse>
    getOutletDataById: (id: string) => Promise<ApiServiceResponse>
    createNewOutlet: (req:Request, outletBody: IOutlet) => Promise<ApiServiceResponse>
    deleteOutletById: (id: string) => Promise<ApiServiceResponse>
    updateOutletById: (outletBody: IOutlet, id: string) => Promise<ApiServiceResponse>
}
