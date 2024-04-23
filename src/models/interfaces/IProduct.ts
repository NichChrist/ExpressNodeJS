export interface IProduct {
    id: string;
    product_category_id: string;
    name: string;
    picture?: string;
    stock: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}