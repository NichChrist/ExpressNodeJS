import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';

export default interface IModelService {
    getModelsData: (req: Request) => Promise<ApiServiceResponse>
    getModelById: (id: string) => Promise<ApiServiceResponse>
    createNewModel: (name: string) => Promise<ApiServiceResponse>
    deleteModelById: (id: string) => Promise<ApiServiceResponse>
    updateModelById: (id: string, name: string) => Promise<ApiServiceResponse>
}
