export interface IProduct {
    id: string;
    name: string;
    description: string;
    code?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}