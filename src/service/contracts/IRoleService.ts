import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IRole } from '../../models/interfaces/IRole';
import { IPermission } from '../../models/interfaces/IPermission';

export default interface IRoleService {
    getRolesData: (req: Request) => Promise<ApiServiceResponse>
    getRoleDataById: (id: string) => Promise<ApiServiceResponse>
    createNewRole: (roleBody: IRole, permissions: IPermission[]) => Promise<ApiServiceResponse>
    deleteRoleById: (id: string) => Promise<ApiServiceResponse>
    updateRoleById: (req: Request) => Promise<ApiServiceResponse>
    reorderByIds: (ids: string[]) => Promise<ApiServiceResponse>
}
