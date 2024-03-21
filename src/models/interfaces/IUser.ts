export interface IUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    is_active?: boolean;
    created_at?: Date;
    updated_at?: Date;
}