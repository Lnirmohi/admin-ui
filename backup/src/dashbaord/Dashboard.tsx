import React, {useContext, useEffect} from 'react';
import { isEqual } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';

import Table from '../admin-table/Table';
import { UserDataDispatchContext, UsersDataContext } from '../context/userDataContext';
import userDataColumnDefination from './userDataTableColumnDefination';
import { TUserData, UserDataActionTypes } from '../types/userTypes';


const Dashboard = () => {
	
	const userData = useContext(UsersDataContext);
	const userDataDispatch = useContext(UserDataDispatchContext);

	const handleRowUpdate = (oldRow: any, newRow: any) => {
		
		if(isEqual(oldRow, newRow)) return oldRow;
		if(userDataDispatch === undefined) return oldRow;

		userDataDispatch({
			type: UserDataActionTypes.UPDATE,
			payload: newRow
		});

		return newRow;
	};

	const hanldeRowDelete = (id: string) => {

		const userToDelte = userData?.find(user => user.id === id);

		if(userDataDispatch === undefined || userToDelte === undefined) return;

		const confirmDelete = confirm(`Delete user: ${userToDelte.name}?`);

		if(confirmDelete === false) return;
		
		try {

			userDataDispatch({
				type: UserDataActionTypes.DELETE,
				payload: userToDelte
			});

			toast.success(`User deleted: ${userToDelte.name}`);
		} catch (error) {
			console.error(error);
			toast.warn(`User deleted: ${userToDelte.name}`);
			throw new Error("Error while deleting user!");
		}
	};

	return (
		<>
		{userData && userData.length > 0 &&
			<Table
				rows={userData} 
				columns={userDataColumnDefination}
				pageSize={10}
				getRowId={(row) => row?.id}
				rowUpdate={handleRowUpdate}
				rowDelete={hanldeRowDelete}
				onPageChange={(newPage) => {/*  */}}
			/>
		}
		<ToastContainer 
			position='top-right'
			autoClose={3000}
		/>
		</>
	);
};
 
export default Dashboard;