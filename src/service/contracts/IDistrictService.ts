import { ApiServiceResponse } from '../../@types/apiServiceResponse';

export default interface IDistrictService {
    listDistrict: (query) => Promise<ApiServiceResponse>;
    getDistrictById: (id: string) => Promise<ApiServiceResponse>;
}
