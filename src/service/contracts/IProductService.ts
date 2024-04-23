import { Request, Response } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IProduct } from '../../models/interfaces/IProduct';

export default interface IProductService {
    createProduct: (productBody: IProduct, req: Request) => Promise<ApiServiceResponse>
    createBulkProduct: (productBody: IProduct[], req: Request) => Promise<ApiServiceResponse>
    getProduct: (req: Request) => Promise<ApiServiceResponse>
    getProductByName: (name: string) => Promise<ApiServiceResponse>
    getProductByBranch: (id:string, req: Request) => Promise<ApiServiceResponse>
    updateProductById: (id: string, name: string) => Promise<ApiServiceResponse>
    deleteProductById: (id: string) => Promise<ApiServiceResponse>
}