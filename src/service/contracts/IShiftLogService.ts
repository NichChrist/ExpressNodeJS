import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IShiftLog } from '../../models/interfaces/IShiftLog';

export default interface IShiftLogService {
    openShift: (shiftBody: IShiftLog) => Promise<ApiServiceResponse>
    closeShift: (shiftBody: IShiftLog, id: string) => Promise<ApiServiceResponse>
    listShiftLog: (name: any, filter: any, req: Request) => Promise<ApiServiceResponse>
    getShiftLogById: (id: string) => Promise<ApiServiceResponse>
}