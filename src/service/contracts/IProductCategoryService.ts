import { Request, Response } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';

export default interface IProductCategoryService {
    createProductCategory: (name: string, req: Request) => Promise<ApiServiceResponse>
    getProductCategoryByName: (name: string) => Promise<ApiServiceResponse>
    updateProductCategoryById: (id: string, name: string) => Promise<ApiServiceResponse>
    deleteProductCategoryById: (id: string) => Promise<ApiServiceResponse>
    getProductCategoriesData: (req: Request) => Promise<ApiServiceResponse>
    // exportToCSV: (res: Response) => Promise<ApiServiceResponse>
    // importFromCSV: (res: Response) => Promise<ApiServiceResponse>
}
