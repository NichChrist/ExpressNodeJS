export default interface IModuleDao {
    getModuleNameById: (id: string, name: string) => Promise<object>;
    isModuleExists: (id: string) => Promise<boolean>;
    isModuleNameExists: (name: string) => Promise<boolean>;
    findModule: (id: string) => Promise<object>;
}
