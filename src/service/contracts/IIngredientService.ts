import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IIngredient } from '../../models/interfaces/IIngredient';

export default interface IIngredientservice {
    createIngredient: (ingredientBody: IIngredient) => Promise<ApiServiceResponse>
    listIngredient: (query) => Promise<ApiServiceResponse>
    getIngredientById: (id: string) => Promise<ApiServiceResponse>
    getBranchIngredientById: (id: string, req: Request) => Promise<ApiServiceResponse>
    deleteBranchIngredientById: (id: string, req: Request) => Promise<ApiServiceResponse>
    deleteIngredientById: (id: string) => Promise<ApiServiceResponse>
    updateIngredientById: (id: string, ingredientBody: IIngredient) => Promise<ApiServiceResponse>
}
