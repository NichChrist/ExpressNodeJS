export interface IRole {
    id: string;
    name: string;
    level: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}