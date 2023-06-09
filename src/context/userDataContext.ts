import { Dispatch, createContext } from "react";
import { TUserData, UserDataDeleteAction, UserDataSetAction, UserDataUpdateAction } from "../types/userTypes";

export const UsersDataContext = createContext<TUserData[] | undefined>(undefined);
export const UserDataDispatchContext = createContext<
	Dispatch<
    UserDataSetAction 
    | UserDataUpdateAction 
    | UserDataDeleteAction
	> 
  | undefined
>(undefined);