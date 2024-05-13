import { Request, Response } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IProduct } from '../../models/interfaces/IProduct';

export default interface IProductService {
    createProduct: (productBody: IProduct, req: Request) => Promise<ApiServiceResponse>
    createBulkProduct: (productBody: IProduct[], req: Request) => Promise<ApiServiceResponse>
    getProduct: (sort: any, name: any, filter:any,  req: Request) => Promise<ApiServiceResponse>
    dropdownProduct: (req: Request) => Promise<ApiServiceResponse>;
    // getProductByBranch: (id:string, req: Request) => Promise<ApiServiceResponse>
    getProductById: (id:string) => Promise<ApiServiceResponse>
    updateProductById: (id: string, productBody: IProduct) => Promise<ApiServiceResponse>
    deleteProductById: (id: string) => Promise<ApiServiceResponse>
}