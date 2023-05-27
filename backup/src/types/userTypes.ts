export type TUserData = {
	email:string;
	id: string;
	name: string;
	role: string;
};

export type TUserDataState = {
	data: TUserData[];
};

export enum UserDataActionTypes {
	DELETE = 'DELETE',
	SET = 'SET',
	UPDATE = 'UPDATE'
}
  
export interface UserDataSetAction {
	type: UserDataActionTypes.SET,
	payload: TUserData[]
}

export interface UserDataUpdateAction {
	type: Exclude<UserDataActionTypes, 'SET'>,
	payload: TUserData
}