import { Dispatch } from "react";
import { TableRowSetAction, TableToggleSelectedSetAction } from "./Table";
import { TableConfig } from "./table-utilities";

export type TableProps<T> = {
	config: TableConfig<T>,
	getRowId: (row: any) => string;
	onPageChange: PageChangeHandler;
	onDeleteSelected: (rowIdsToDelete: string[]) => void;
};

export type TableColumn = {
	header: string;
	field: string;
	width: number;
	transform?: (value: string) => string
}

export type TableRowProps<T> = {
	rowData: any;
	columnData: TableColumn[];
	update: (oldRow: any, newRow: any) => any;
	rowDelete: (id: string) => void;
	tableRowDispatch: Dispatch<TableRowSetAction<T> | TableToggleSelectedSetAction>
};

export type TablePaginationPropsType = {
	pageCount: number;
	handlePageChange: PageChangeHandler;
};

export type PageChangeHandler = (newPage: number) => void;
