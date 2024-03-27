import { ApiServiceResponse } from '../../@types/apiServiceResponse';

export default interface IProvinceService {
    listProvince: (query) => Promise<ApiServiceResponse>;
    getProvinceById: (id: string) => Promise<ApiServiceResponse>;
}
