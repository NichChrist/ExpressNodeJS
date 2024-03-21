export interface IPermission {
    module_id: string;
    module_name: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    change_password?: boolean,
    reset_password?: boolean,
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}