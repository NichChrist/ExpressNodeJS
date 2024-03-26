import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IOutlet } from '../../models/interfaces/IOutlet';

export default interface IOutletervice {
    getOutletsData: (req: Request) => Promise<ApiServiceResponse>
    getOutletDataById: (id: string) => Promise<ApiServiceResponse>
    createNewOutlet: (outletBody: IOutlet) => Promise<ApiServiceResponse>
    deleteOutletById: (id: string) => Promise<ApiServiceResponse>
    updateOutletById: (outletBody: IOutlet, id: string) => Promise<ApiServiceResponse>
}
