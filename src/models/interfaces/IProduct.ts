export interface IProduct {
    id: string;
    name: string;
    price: number;
    sku: string;
    product_category_id: string;
    picture?: string;
    stock: number;
    outlet_id: string[];
    modifier_id: string[];
    outlet_product_state: Array<any>;
}