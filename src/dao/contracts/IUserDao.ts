import { IUser } from '../../models/interfaces/IUser';

export default interface IUserDao {
    getByUsername: (username: string) => Promise<IUser>;
    isUsernameExists: (username: string) => Promise<boolean>;
    createWithTransaction: (user: object, transaction: object) => Promise<IUser>;
}
