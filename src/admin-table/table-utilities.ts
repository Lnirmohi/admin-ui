import { TableColumn, PageChangeHandler } from "./table.types";

export function useTable<T>({
  rows,
  columns,
  pageSize,
	rowUpdate,
	rowDelete,
}: TableConfig<T>): {
  rows: (T & {
    selected: boolean;
  })[],
  columns: TableColumn[],
  pageSize: number,
  rowUpdate: (oldRow: any, newRow: any) => void
  rowDelete: (rowId: string) => void
} {
  return {
    rows: rows.map(item => ({...item, selected: false})),
    columns: columns,
    pageSize: pageSize,
    rowUpdate: rowUpdate,
    rowDelete: rowDelete,
  };
}

export type TableConfig<T> = {
  rows: T[],
  columns: TableColumn[];
  pageSize: number;
	rowUpdate: (oldRow: any, newRow: any) => void;
	rowDelete: (rowId: string) => void;
}