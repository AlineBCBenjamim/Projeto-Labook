import { BaseDatabase } from "./BaseDatabase";

export class UserDataBase extends BaseDatabase{
    public static TABLE_USERS = "users"

    public getAllUsers = async () => {
        const usersDB = await BaseDatabase
        .connection(UserDataBase.TABLE_USERS)
        .select()
    return usersDB
    }
}