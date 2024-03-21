export default interface IModelDao {
    getModelNameById: (id: string, name: string) => Promise<object>;
    isModelExists: (id: string) => Promise<boolean>;
    isModelNameExists: (name: string) => Promise<boolean>;
    findModel: (id: string) => Promise<object>;
}
