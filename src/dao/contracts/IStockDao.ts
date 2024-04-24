export default interface IStockDao {
    list: (scopes: any, pagination?: string, page?: number, row?: number) => Promise<object>;
    isStockExists: (id: string) => Promise<boolean>;
    getById:(scopes: string, id: string) => Promise<object>;
    deleteById:(id: string) => Promise<object>;
}