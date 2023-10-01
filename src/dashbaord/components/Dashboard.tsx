import {useContext} from 'react';
import { isEqual } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';

import { UserDataDispatchContext, UsersDataContext } from '../types/userDataContext.ts';
import userDataColumnDefination from './userDataTableColumnDefination.ts';
import { TUserData, UserDataActionTypes } from '../types/userTypes.ts';
import { useTable } from '../../admin-table/utils/table-utilities';
import Table from '../../admin-table/index.ts';


const Dashboard = () => {
	
	const userData = useContext(UsersDataContext);
	const userDataDispatch = useContext(UserDataDispatchContext);

	const handleRowUpdate = (oldRow: any, newRow: any) => {
		
		if(isEqual(oldRow, newRow)) return oldRow;
		if(userDataDispatch === undefined) return oldRow;

		const userDataRow = userData?.find(item => item.id === newRow.id);
		const updateduserData = {...newRow};

		if(userDataRow === undefined) return oldRow;

		const keys = Object.keys(userDataRow);
		
		for(const key of Object.keys(updateduserData)) {	

			if(!(keys.includes(key) )) {
				delete updateduserData[key];
			}
		}

		userDataDispatch({
			type: UserDataActionTypes.UPDATE,
			payload: updateduserData as TUserData
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
				payload: [userToDelte.id]
			});

			toast.success(`User deleted: ${userToDelte.name}`);
		} catch (error) {
			console.error(error);
			toast.warn(`User deleted: ${userToDelte.name}`);
			throw new Error("Error while deleting user!");
		}
	};

	const tableConfig = useTable({
		rows: userData ?? [],
		columns: userDataColumnDefination,
		pageSize: 10,
		rowUpdate: handleRowUpdate,
		rowDelete: hanldeRowDelete,
	});

	return (
		<>
			<Table
				config={tableConfig}
				getRowId={(row) => row?.id}
				onPageChange={() => {/*  */}}
				onDeleteSelected={(rowIdsToDelete) => {

					if(userDataDispatch === undefined) return;
					console.log(rowIdsToDelete);

					userDataDispatch({
						type: UserDataActionTypes.DELETE,
						payload: rowIdsToDelete
					});
				}}
			/>
		
			<ToastContainer 
				position='top-right'
				autoClose={3000}
			/>
		</>
	);
};
 
export default Dashboard;