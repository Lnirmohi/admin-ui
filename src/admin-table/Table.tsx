import React, { FC, useCallback, useEffect, useReducer, useState } from "react";
import { PageChangeHandler, TableColumn, TableProps } from "./table.types";
import "./Table.css";
import TableRow from "./tableRow";
import TablePagination from "./TablePagination";

export enum TableRowActionType {
  SET = 'SET',
  TOGGLE_SELECTED = 'TOGGLE_SELECTED',
  TOGGLE_ALL_SELECTED = 'TOGGLE_ALL_SELECTED'
}

export type TableRowSetAction<T> = {
  type: TableRowActionType.SET;
  payload: T[];
}

export type TableToggleSelectedSetAction = {
  type: TableRowActionType.TOGGLE_SELECTED;
  payload: string;
}

export type TableTogleAllSelectedAction = {
  type: TableRowActionType.TOGGLE_ALL_SELECTED,
  payload: {
    isAllSelected: boolean;
    visibleRowIds: string[]
  };
}

type TableActionTypes<T extends {selected: boolean; id: string;}> = TableRowSetAction<T> | TableToggleSelectedSetAction | TableTogleAllSelectedAction;

const tableRowReducer = <T extends {selected: boolean; id: string;}, >(state: T[], action: TableActionTypes<T>) => {

  switch (action.type) {

    case TableRowActionType.SET:

      state = action.payload.map((row) => ({...row, selected: false}));
      break;
    case TableRowActionType.TOGGLE_SELECTED: {

      const selectedToggledRow = state.find(item => item.id === action.payload);
  
      if(selectedToggledRow !== undefined) {
        state = [...state].map(item => {

          if(item.id === selectedToggledRow.id) {
            return {
              ...selectedToggledRow,
              selected: !selectedToggledRow.selected
            };
          }

          return item;
        });
      }
      break;
    }
    case TableRowActionType.TOGGLE_ALL_SELECTED:
      state = [...state].map(item => (
        action.payload.visibleRowIds.includes(item.id)
        ? {...item, selected: action.payload.isAllSelected}
        : item
      ));
      break;
    default:
      return state;
  }

  return state;
};

const Table = <T extends {selected: boolean; id: string;}>({
  config,
  getRowId,
  onPageChange,
  onDeleteSelected,
}: TableProps<T>) => {

  const [allSelected, setAllSelected] = useState<boolean>();
  const [activePage, setActivePage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [tableRows, tableRowDispatch] = useReducer<typeof tableRowReducer<T>>(tableRowReducer<T>, []);
  // const [tableRowsToShow, setTableRowsToShow] = useState<T[]>();

  const {
    rows,
    columns,
    pageSize,
    rowUpdate,
    rowDelete,
  } = config;

  useEffect(() => {
    setPageCount(Math.ceil(rows.length / pageSize));
  }, [pageSize, rows.length]);

  useEffect(() => {
    if (rows.length === 0) return;
    
    tableRowDispatch({
      type: TableRowActionType.SET,
      payload: rows
    });

  }, [rows]);


  useEffect(() => {
    if(allSelected === undefined) return;

    tableRowDispatch({
      type: TableRowActionType.TOGGLE_ALL_SELECTED,
      payload: {
        isAllSelected: allSelected,
        visibleRowIds: tableRows
          .slice((activePage - 1) * pageSize, activePage * pageSize)
          .map(item => item.id)
      }
    });
  }, [allSelected]);
  

  const handleDeleteSelected = () => {
    const selectedRows = tableRows.filter(row => {
      return row.selected === true;
    })
    .map(item => item.id);

    onDeleteSelected(selectedRows);

    if(allSelected) {
      setAllSelected(false);

      // handle delete all from last page
      if(activePage === pageCount) {
        setActivePage(activePage -1);
      }
    }
  };

  if(tableRows.length === 0) {
    return <p>No data provided</p>;
  }

  return (
    <div className="min-w-full">
      <table>
        <thead>
          <tr>
            <th className="px-2 py-3">
              <input
                type="checkbox"
                checked={allSelected ?? false}
                onChange={() => {
                  setAllSelected(!allSelected);
                }}
              />
            </th>
            {columns.map((column) => (
              <th
                className=""
                style={{ width: `${column["width"]}%` }}
                key={column.field}
              >
                {column.header}
              </th>
            ))}
            <th className="">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableRows && tableRows
            .slice((activePage - 1) * pageSize, activePage * pageSize)
            .map((row) => (
              <TableRow
                update={rowUpdate}
                rowDelete={rowDelete}
                rowData={row}
                columnData={columns}
                key={getRowId(row)}
                tableRowDispatch={tableRowDispatch}
              />
            ))}
        </tbody>
      </table>

      <div className="">
        <button onClick={handleDeleteSelected}>Delete Selected</button>
        <TablePagination
          pageCount={pageCount}
          handlePageChange={(newPage: number) => {
            setActivePage(newPage);
            onPageChange(newPage);
            setAllSelected(false);

            tableRowDispatch({
              type: TableRowActionType.TOGGLE_ALL_SELECTED,
              payload: {
                isAllSelected: false,
                visibleRowIds: tableRows && tableRows
                  .slice((activePage - 1) * pageSize, activePage * pageSize)
                  .map(item => item.id)
              }
            });
          }}
        />
      </div>
    </div>
  );
};

export default Table;
