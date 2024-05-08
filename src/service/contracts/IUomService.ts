import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IUom } from '../../models/interfaces/IUom';

export default interface IUomService {
    createUom: (uomBody: IUom, req: Request) => Promise<ApiServiceResponse>;
    createBulkUom: (uomBody: IUom[], req: Request) => Promise<ApiServiceResponse>;
    listUom: (name: any, req: Request) => Promise<ApiServiceResponse>;
    dropdownUom: (req: Request) => Promise<ApiServiceResponse>;
    getUomById: (id: string, req: Request)=> Promise<ApiServiceResponse>;
    updateUomById: (id: string, uomBody: IUom, req: Request) => Promise<ApiServiceResponse>;
    deleteUomById: (id: string, req: Request) => Promise<ApiServiceResponse>;
}   