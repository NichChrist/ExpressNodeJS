export interface IShiftLog {
    id: string;
    user_id: string;
    cashier_code: string;
    start_time: Date;
    end_time?: Date;
    initial_balance: number;
    total_sales: number;
    cash: number;
    closing_balance: number;
    status: string;
    cashless_shift_log: Array<any>;
}