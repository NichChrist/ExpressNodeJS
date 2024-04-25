import { ApiServiceResponse } from '../../@types/apiServiceResponse';

export default interface ISubdistrictService {
    listSubdistrict: (query) => Promise<ApiServiceResponse>;
    dropdownSubdistrict: () => Promise<ApiServiceResponse>;
    getSubdistrictById: (id: string) => Promise<ApiServiceResponse>;
}
