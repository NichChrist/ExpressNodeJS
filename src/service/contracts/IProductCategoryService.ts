import { Request, Response } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';

export default interface IProductCategoryService {
    createNewProductCategory: (name: string) => Promise<ApiServiceResponse>
    getProductCategoryByName: (name: string) => Promise<ApiServiceResponse>
    updateProductCategoryById: (id: string, name: string) => Promise<ApiServiceResponse>
    deleteProductCategoryById: (id: string) => Promise<ApiServiceResponse>
    getProductCategoriesData: (req: Request) => Promise<ApiServiceResponse>
    exportToCSV: (req : Request) => Promise<ApiServiceResponse>
    // importFromCSV: (req : Request) => Promise<ApiServiceResponse>
}
