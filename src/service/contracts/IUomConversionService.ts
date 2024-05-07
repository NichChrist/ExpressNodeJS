import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IUomConversion } from '../../models/interfaces/IUomConversion';

export default interface IUomConversionService {
    createUomConversion: (uomBody: IUomConversion[]) => Promise<ApiServiceResponse>
    updateUomConversion: (uomBody: IUomConversion[]) => Promise<ApiServiceResponse>
    listUomConversion: (name: any, req: Request) => Promise<ApiServiceResponse>
    deleteUomConversionById: (id: string, req: Request) => Promise<ApiServiceResponse>
    createFromCsv: (uomBody: IUomConversion[], req: Request) => Promise<ApiServiceResponse>
}