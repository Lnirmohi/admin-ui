import { ADMIN_DATA_URL } from "../constants/constants";
import { TUserData } from "../types/userTypes";

export const fetchUserData = async (): Promise<TUserData[]> => {
    
	const res = await fetch(ADMIN_DATA_URL);

	const data: TUserData[] = await res.json();

	return data;
};