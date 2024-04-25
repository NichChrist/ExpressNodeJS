export interface IProduct {
    id: string;
    name: string;
    price: number;
    sku: string;
    product_category_id: string;
    picture?: string;
    stock: number;
    outlet_id: string[];
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}