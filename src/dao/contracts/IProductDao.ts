export default interface IProductDao {
    isProductExists: (id: string) => Promise<boolean>;
    isProductNameExists: (name: string) => Promise<boolean>;
    isProductSkuExists: (sku: string) => Promise<boolean>;
    deleteById: (id: string) => Promise<object>;
    findProduct: (id: string) => Promise<object>;
    getProductByName: (name: string) => Promise<object>;
}
