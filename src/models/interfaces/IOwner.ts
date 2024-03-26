export interface IOwner {
    //userBody
    username: string;
    password: string;
    is_active: boolean;
    name: string;
    email: string;
    phone_number: string;
    //outletBody
    business_type_id: string;
    outlet_name: string;
    code: string;
    description?: string;
    address?: string;
    outlet_parent_id?: string;
    subdistrict_id: string | null;
    postal_code: string | null;
    phone: string;
}