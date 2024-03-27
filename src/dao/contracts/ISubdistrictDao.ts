export default interface ISubistrictDao {
    list: (scopes: any, pagination?: string, page?: number, row?: number) => Promise<object>;
    getById:(scopes: string, id: string) => Promise<object>;
}