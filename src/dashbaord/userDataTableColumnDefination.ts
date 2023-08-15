import { TableColumn } from "../admin-table/table.types";

const userDataColumnDefination: TableColumn[] = [
	{
		header: 'Name',
		field: 'name',
		width: 25,
	},
	{
		header: 'Email',
		field: 'email',
		width: 30,
	},
	{
		header: 'Role',
		field: 'role',
		width: 15,
		transform(value) {
			return value[0].toUpperCase() + value.slice(1);
		},
	},
	
];

export default userDataColumnDefination;