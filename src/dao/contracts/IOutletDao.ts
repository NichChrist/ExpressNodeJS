export default interface IOutletDao {
    list: (scopes: any, pagination?: string, page?: number, row?: number) => Promise<object>;
    isOutletExists: (email: string) => Promise<boolean>;
    isOutletNameExists: (name: string) => Promise<boolean>;
    isOutletCodeExists: (code: string) => Promise<boolean>;
    findOutlet: (id: string) => Promise<object>;
}
