export type TableProps = {
	rows: any[],
	columns: TableColumn[];
	pageSize: number;
	getRowId: (row: any) => string;
	rowUpdate: (oldRow: any, newRow: any) => void;
	rowDelete: (rowId: string) => void; 
	onPageChange: PageChangeHandler;
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
};

export type TablePaginationPropsType = {
	pageCount: number;
	handlePageChange: PageChangeHandler;
};

export type PageChangeHandler = (newPage: number) => void;
