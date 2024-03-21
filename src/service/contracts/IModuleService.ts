import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';

export default interface IModuleService {
    getModulesData: (req: Request) => Promise<ApiServiceResponse>
    getModulesById: (id: string) => Promise<ApiServiceResponse>
    createNewModule: (name: string) => Promise<ApiServiceResponse>
    deleteModuleById: (id: string) => Promise<ApiServiceResponse>
    updateModuleById: (id: string, name: string) => Promise<ApiServiceResponse>
}
