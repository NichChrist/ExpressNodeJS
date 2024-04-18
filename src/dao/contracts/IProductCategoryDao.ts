export default interface IProductCategoryDao {
    getProductCategoryByName: (name: string) => Promise<object>;
    isProductCategoryExists: (id: string) => Promise<boolean>;
    isProductCategoryNameExists: (name: string) => Promise<boolean>;
    findProductCategory: (id: string) => Promise<object>;
    findProductCategoryByName: (name: string) => Promise<object>;
}
