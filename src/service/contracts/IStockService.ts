import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IStock } from '../../models/interfaces/IStock';

export default interface IStockService {
    listStock: (query) => Promise<ApiServiceResponse>;
    getStockById: (id: string) => Promise<ApiServiceResponse>
    updateStockById: (id: string, stockBody: IStock) => Promise<ApiServiceResponse>
    deleteStockById: (id: string) => Promise<ApiServiceResponse>
}