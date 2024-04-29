export default interface IProductDao {
    isProductExists: (id: string) => Promise<boolean>;
    isProductNameExists: (name: string) => Promise<boolean>;
    findProduct: (id: string) => Promise<object>;
    getProductByName: (name: string) => Promise<object>;
}
