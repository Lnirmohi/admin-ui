import { Dispatch } from "react";
import { TableRowSetAction, TableToggleSelectedSetAction } from "./Table";

export type TableProps = {
	rows: any[],
	columns: TableColumn[];
	pageSize: number;
	getRowId: (row: any) => string;
	rowUpdate: (oldRow: any, newRow: any) => void;
	rowDelete: (rowId: string) => void; 
	onPageChange: PageChangeHandler;
	onDeleteSelected: (rowIdsToDelete: string[]) => void;
};

export type TableColumn = {
	header: string;
	field: string;
	width: number;
}

export type TableRowProps = {
	rowData: any;
	columnData: TableColumn[];
	update: (oldRow: any, newRow: any) => any;
	rowDelete: (id: string) => void;
	tableRowDispatch: Dispatch<TableRowSetAction | TableToggleSelectedSetAction>
};

export type TablePaginationPropsType = {
	pageCount: number;
	handlePageChange: PageChangeHandler;
};

export type PageChangeHandler = (newPage: number) => void;
