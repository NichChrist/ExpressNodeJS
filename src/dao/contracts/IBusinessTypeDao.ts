export default interface IBusinessTypeDao {
    getBusinessTypeNameById: (id: string, name: string) => Promise<object>;
    isBusinessTypeExists: (id: string) => Promise<boolean>;
    isBusinessTypeNameExists: (name: string) => Promise<boolean>;
    findBusinessType: (id: string) => Promise<object>;
}
