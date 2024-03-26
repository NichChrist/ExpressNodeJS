export default interface IOutletDao {
    isOutletExists: (email: string) => Promise<boolean>;
    isOutletNameExists: (name: string) => Promise<boolean>;
    isOutletCodeExists: (code: string) => Promise<boolean>;
    findOutlet: (id: string) => Promise<object>;
}
