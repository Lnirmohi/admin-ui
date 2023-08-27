import { Dispatch } from "react";
import { TableRowSetAction, TableToggleSelectedSetAction } from "./TableV2.tsx";
import { TableConfig } from "./table-utilities";

export type RowType = Record<string, string | number | boolean> & {id: string;};

export type TableProps = {
	config: TableConfig,
	getRowId: (row: RowType) => string;
	onPageChange: PageChangeHandler;
	onDeleteSelected: (rowIdsToDelete: string[]) => void;
};

export type TableColumn = {
	header: string;
	field: string;
	width: number;
	transform?: (value: string) => string
}

export type TableRowProps = {
	rowData: RowType & {selected: boolean;};
	columnData: TableColumn[];
	update: (oldRow: RowType  & {selected: boolean;}, newRow: RowType & {selected: boolean;}) => RowType & {selected: boolean;};
	rowDelete: (id: string) => void;
	tableRowDispatch: Dispatch<TableRowSetAction | TableToggleSelectedSetAction>
};

export type TablePaginationPropsType = {
	pageCount: number;
	handlePageChange: PageChangeHandler;
};

export type PageChangeHandler = (newPage: number) => void;
