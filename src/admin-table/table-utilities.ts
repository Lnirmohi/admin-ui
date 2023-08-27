import { TableColumn, PageChangeHandler, RowType } from "./table.types";

export function useTable({ rows, columns, pageSize, rowUpdate, rowDelete}: TableConfig): {
  rows:RowType[],
  columns: TableColumn[],
  pageSize: number,
  rowUpdate: (oldRow: RowType & {selected: boolean;}, newRow: RowType & {selected: boolean;}) => RowType & {selected: boolean;}
  rowDelete: (rowId: string) => void
} {
  return {
    rows: rows,
    columns: columns,
    pageSize: pageSize,
    rowUpdate: rowUpdate,
    rowDelete: rowDelete,
  };
}

export type  TableConfig = {
  rows: RowType[],
  columns: TableColumn[];
  pageSize: number;
	rowUpdate: (oldRow: RowType & {selected: boolean;}, newRow: RowType & {selected: boolean;}) => RowType & {selected: boolean;}
	rowDelete: (rowId: string) => void;
}