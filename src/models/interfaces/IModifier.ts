export interface IModifier {
    id: string;
    name: string;
    description?: string;
    option_type: string;
    product_id: string[];
    modifier_detail:Array<any>;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
}