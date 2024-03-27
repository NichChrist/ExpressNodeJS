import { ApiServiceResponse } from '../../@types/apiServiceResponse';

export default interface ISubdistrictService {
    listSubdistrict: (query) => Promise<ApiServiceResponse>;
    getSubdistrictById: (id: string) => Promise<ApiServiceResponse>;
}
