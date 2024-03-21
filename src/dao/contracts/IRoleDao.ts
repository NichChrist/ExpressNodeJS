export default interface IRoleDao {
    isRoleExists: (email: string) => Promise<boolean>;
    isRoleNameExists: (name: string) => Promise<boolean>;
    findByOtherRoleName: (id: string, name: string) => Promise<boolean>;
    isRoleLevelExists: (level: number) => Promise<boolean>;
    getRoleWithPermissions: (id: string) => Promise<object>;
}
