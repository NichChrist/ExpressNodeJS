import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';

export default interface IModelService {
    getBusinessTypesData: (req: Request) => Promise<ApiServiceResponse>
    getBusinessTypeById: (id: string) => Promise<ApiServiceResponse>
    createNewBusinessType: (name: string) => Promise<ApiServiceResponse>
    deleteBusinessTypeById: (id: string) => Promise<ApiServiceResponse>
    updateBusinessTypeById: (id: string, name: string) => Promise<ApiServiceResponse>
}
