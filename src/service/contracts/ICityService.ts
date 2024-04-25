import { ApiServiceResponse } from '../../@types/apiServiceResponse';

export default interface ICityService {
    listCity: (query) => Promise<ApiServiceResponse>;
    dropdownCity: () => Promise<ApiServiceResponse>;
    getCityById: (id: string) => Promise<ApiServiceResponse>;
}
