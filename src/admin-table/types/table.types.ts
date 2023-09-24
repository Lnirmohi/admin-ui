import { Dispatch, ReactNode, SetStateAction } from "react";
import { TableRowSetAction, TableToggleSelectedSetAction } from "../index.js";
import { TableConfig } from "../utils/table-utilities.js";

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
	children: ReactNode;
};

export type TablePaginationPropsType = {
	pageCount: number;
	handlePageChange: PageChangeHandler;
};

export type PageChangeHandler = (newPage: number) => void;
