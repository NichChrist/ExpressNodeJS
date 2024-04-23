export default interface IProductDao {
    getProductByName: (name: string) => Promise<object>;
    isProductExists: (id: string) => Promise<boolean>;
    isProductNameExists: (name: string) => Promise<boolean>;
    findProduct: (id: string) => Promise<object>;
    findProductByName: (name: string) => Promise<object>;
}
