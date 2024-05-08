export default interface IModifierDao {
    list: (scopes: any, pagination?: string, page?: number, row?: number) => Promise<object>;
    isModifierExists: (id: string) => Promise<boolean>;
    isModifierNameExists: (name: string) => Promise<boolean>;
    getModifierById: (id: string) => Promise<object>;
    getModifierByName: (name: string) => Promise<object>;
    deleteById: (id: string) => Promise<object>;
}
