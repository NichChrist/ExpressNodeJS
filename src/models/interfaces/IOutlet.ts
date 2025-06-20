export interface IOutlet {
    id?: string;
    business_type_id: string;
    name: string;
    code: string;
    description?: string;
    address?: string;
    parent_id?: string;
    subdistrict_id: string | null;
    postal_code: string | null;
    phone: string;
}