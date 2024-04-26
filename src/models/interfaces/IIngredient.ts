export interface IIngredient {
    id: string;
    name: string;
    uom_id: string;
    outlet_id: string[];
    stock: number[];
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}