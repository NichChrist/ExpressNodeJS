import { Request, Response } from "express";
import httpStatus from "http-status";
import { ApiServiceResponse } from "../@types/apiServiceResponse";
import { IProduct } from "../models/interfaces/IProduct";
import ProductService from "../service/implementations/ProductService";
import { responseMessageConstant } from "../config/constant";

export default class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    getProduct = async (req: Request, res: Response) => {
        try {
            const product = await this.productService.getProduct(req);
            const { code, message } = product.response;
            const data: any = product.response.data;

            res.status(product.statusCode).json({
                code,
                message,
                count: data.count,
                data: data.rows
            })

        } catch (e) {
            res.status(httpStatus.BAD_GATEWAY).json({
                status: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    }

    getProductById = async (req: Request, res: Response) => {
        try {
            const product = await this.productService.getProductById(req.params.id);
            const { code, message } = product.response;
            const data: any = product.response.data;

            res.status(product.statusCode).json({
                code, message, data
            })
        } catch (e) {
            res.status(httpStatus.BAD_GATEWAY).json({
                status: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    }

    createProduct = async (req: Request, res: Response) => {
        try {
            const product = await this.productService.createProduct(req.body)
            const { code, message, data } = product.response

            res.status(code).send({ code, message, data })
        } catch (e) {
            res.status(httpStatus.BAD_GATEWAY).json({
                status: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    }

    updateProduct = async (req: Request, res: Response) => {
        try {
            const product = await this.productService.updateProduct(req.body, req.params.id);
            const { code, message } = product.response
            const data: any = product.response.data

            res.status(product.statusCode).json({
                code,
                message,
                data
            })

        } catch (e) {
            res.status(httpStatus.BAD_GATEWAY).json({
                status: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    }


    deleteProduct = async (req: Request, res: Response) => {
        try {
            const product = await this.productService.deleteProduct(req.params.id);
            const { code, message } = product.response;

            res.status(product.statusCode).json({
                code, 
                message
            })
        } catch (e) {
            res.status(httpStatus.BAD_GATEWAY).json({
                status: httpStatus.BAD_GATEWAY,
                message: 'Something Went Wrong',
            });
        }
    }
}
