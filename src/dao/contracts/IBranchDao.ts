export default interface IBranchDao {
    list: (scopes: any, pagination?: string, page?: number, row?: number) => Promise<object>;
    isBranchExists: (email: string) => Promise<boolean>;
    isBranchNameExists: (name: string) => Promise<boolean>;
    isBranchCodeExists: (code: string) => Promise<boolean>;
    getById: (id: string) => Promise<object>;
}
