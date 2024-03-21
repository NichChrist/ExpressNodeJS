import { Request } from "express";
import { ApiServiceResponse } from "../../@types/apiServiceResponse";
import { IProduct } from "../../models/interfaces/IProduct";

export default interface IProductService{
    createProduct: (productBody: IProduct) => Promise<ApiServiceResponse>;
    getProduct: (req: Request) => Promise<ApiServiceResponse>;
    getProductById: (id: string) => Promise<ApiServiceResponse>;
    updateProduct: (productBody: IProduct, id: string) => Promise<ApiServiceResponse>;
    deleteProduct: (id: string) => Promise<ApiServiceResponse>;
}