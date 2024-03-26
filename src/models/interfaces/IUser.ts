export interface IUser {
    id: string;
    username: string;
    password: string;
    is_active?: boolean;
    is_pwd_resetted?: boolean;
    parent_id?: string;
    created_at?: Date;
    updated_at?: Date;
    name: string;
    email: string;
    phone_number: string;
    outlet_id?:string;
}