export default interface IPermissionDao {
    findPermission: (module_id: string, action: string) => Promise<Object>;
    createNewPermission: (module_id: string, action: string, t) => Promise<Object>;
}
