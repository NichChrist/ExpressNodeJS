export default interface IUomDao {
    isUomExists: (id: string) => Promise<boolean>;
    getUomByName: (name: string) => Promise<object>;
    deleteById: (id: string) => Promise<object>;
}
