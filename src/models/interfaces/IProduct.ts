export interface IProduct {
    id: string;
    name: string;
    product_category_id: string;
    picture?: string;
    stock: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}