import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IUom } from '../../models/interfaces/IUom';

export default interface IUomService {
    createUom: (uomBody: IUom) => Promise<ApiServiceResponse>
    createBulkUom: (uomBody: IUom[]) => Promise<ApiServiceResponse>
    listUom: (name: any, req: Request) => Promise<ApiServiceResponse>
    dropdownUom: () => Promise<ApiServiceResponse>;
    updateUomById: (id: string, uomBody: IUom) => Promise<ApiServiceResponse>
    deleteUomById: (id: string) => Promise<ApiServiceResponse>
}   