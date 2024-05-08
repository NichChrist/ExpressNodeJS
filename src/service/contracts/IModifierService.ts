import { Request} from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IModifier } from '../../models/interfaces/IModifier';

export default interface IModifierService {
    createModifier: (productBody: IModifier) => Promise<ApiServiceResponse>
    dropdownModifier: (req: Request) => Promise<ApiServiceResponse>;
    listModifier: (name: any, filter:any,  req: Request) => Promise<ApiServiceResponse>
    getModifierById: (id:string, req: Request) => Promise<ApiServiceResponse>
    updateModifierById: (id: string, modifierBody: IModifier, req: Request) => Promise<ApiServiceResponse>
    deleteModifierById: (id: string) => Promise<ApiServiceResponse>
    // createModifierFromCsv: (productBody: IModifier[], req: Request) => Promise<ApiServiceResponse>
}