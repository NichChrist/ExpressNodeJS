export interface IStock {
    id: string;
    outlet_id: string;
    product_id: string;
    stock: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}